import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


import type { CreateProjectSchemaType, UpdateProjectSchemaType } from "../Utils/Schema/projectSchema";
import { addMember, createProject, deleteProject, getProjectById, getProjects, removeMember, updateProject } from "../Apis/ProjectApi";


export const useGetProjects = (
  token: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }
) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjects(token, params),
  });
};

export const useGetProjectById = (
  id: string,
  token: string
) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id, token),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      token,
    }: {
      data: CreateProjectSchemaType;
      token: string;
    }) => createProject(data, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      token,
    }: {
      id: string;
      data: UpdateProjectSchemaType;
      token: string;
    }) => updateProject(id, data, token),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["project", variables.id],
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      token,
    }: {
      id: string;
      token: string;
    }) => deleteProject(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

export const useAddMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
      token,
    }: {
      projectId: string;
      userId: string;
      token: string;
    }) => addMember(projectId, userId, token),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
      token,
    }: {
      projectId: string;
      userId: string;
      token: string;
    }) => removeMember(projectId, userId, token),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};