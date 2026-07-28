import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateTaskSchemaType, UpdateTaskSchemaType } from "../Utils/Schema/taskSchema";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../Apis/TasksApi";

export const useGetTasks = (
  projectId: string,
  token: string,
  params?: {
    status?: string;
    priority?: string;
    assignee?: string;
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

    onSuccess: (_, variables) => {
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