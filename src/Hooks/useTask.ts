import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../Store/store";

import type { CreateTaskSchemaType, UpdateTaskSchemaType } from "../Utils/Schema/taskSchema";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../Apis/TasksApi";

export const useGetTasks = (
  projectId: string,
  token: string,
  params?: {
    status?: string;
    priority?: string;
    assignee?: string;
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }
) => {
  return useQuery({
    queryKey: ["tasks", projectId, params],
    queryFn: () => getTasks(projectId, token, params),
    enabled: !!projectId,
  });
};

export const useGetTaskById = (
  projectId: string,
  taskId: string,
  token: string
) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById(projectId, taskId, token),
    enabled: !!projectId && !!taskId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
      token,
    }: {
      projectId: string;
      data: CreateTaskSchemaType;
      token: string;
    }) => createTask(projectId, data, token),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
      data,
      token,
    }: {
      projectId: string;
      taskId: string;
      data: UpdateTaskSchemaType;
      token: string;
    }) => updateTask(projectId, taskId, data, token),

    // 1. When mutate is called:
    onMutate: async ({ projectId, taskId, data }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      // Snapshot the previous values across all active task lists for this project
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll({ queryKey: ["tasks", projectId] });

      const previousQueriesData = queries.map((query) => ({
        queryKey: query.queryKey,
        data: query.state.data,
      }));

      // Optimistically update all matching queries in the cache
      queries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (old: any) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((task: any) => {
              if (task._id === taskId) {
                const newStatusHistory = task.statusHistory ? [...task.statusHistory] : [];
                if (data.status && data.status !== task.status) {
                  newStatusHistory.push({
                    oldStatus: task.status,
                    newStatus: data.status,
                    changedAt: new Date().toISOString(),
                    changedBy: { userName: user?.userName || "Unknown", _id: user?._id || "optimistic" },
                  });
                }

                return {
                  ...task,
                  ...data,
                  assignee: task.assignee,
                  statusHistory: newStatusHistory,
                };
              }
              return task;
            }),
          };
        });
      });

      // Return a context object with the snapshotted values
      return { previousQueriesData };
    },

    // 2. If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _variables, context) => {
      if (context?.previousQueriesData) {
        context.previousQueriesData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // 3. Always refetch after success or error to sync with the server
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
      token,
    }: {
      projectId: string;
      taskId: string;
      token: string;
    }) => deleteTask(projectId, taskId, token),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
    },
  });
};