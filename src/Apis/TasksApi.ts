import axios from "axios";

import type {
  CreateTaskSchemaType,
  UpdateTaskSchemaType,
} from "../Utils/Schema/taskSchema";


import { baseURL } from "../Constants/BaseUrl";
import type { TaskResponse, TasksResponse, Task } from "../Interfaces/ITasks";
import type { MessageResponse } from "../Interfaces/Iproject";

const headers = (token: string) => ({
  "Content-Type": "application/json",
  "x-client-user-agent": navigator.userAgent,
  authentication: `bearer ${token}`,
});

export const createTask = async (
  projectId: string,
  data: CreateTaskSchemaType,
  token: string
): Promise<TaskResponse> => {
  const res = await axios.post<TaskResponse>(
    `${baseURL}/projects/${projectId}/tasks`,
    data,
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const getTasks = async (
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
): Promise<TasksResponse> => {
  const res = await axios.get<TasksResponse>(
    `${baseURL}/projects/${projectId}/tasks`,
    {
      headers: headers(token),
      params,
    }
  );

  return res.data;
};

export const getTaskById = async (
  projectId: string,
  taskId: string,
  token: string
): Promise<TaskResponse> => {
  const res = await axios.get<TaskResponse>(
    `${baseURL}/projects/${projectId}/tasks/${taskId}`,
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const updateTask = async (
  projectId: string,
  taskId: string,
  data: UpdateTaskSchemaType,
  token: string
): Promise<TaskResponse> => {
  const res = await axios.put<TaskResponse>(
    `${baseURL}/projects/${projectId}/tasks/${taskId}`,
    data,
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const deleteTask = async (
  projectId: string,
  taskId: string,
  token: string
): Promise<MessageResponse> => {
  const res = await axios.delete<MessageResponse>(
    `${baseURL}/projects/${projectId}/tasks/${taskId}`,
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const createAiTaskBreakdown = async (
  projectId: string,
  data: { description: string },
  token: string
): Promise<{ success: boolean; data: Task[] }> => {
  const res = await axios.post<{ success: boolean; data: Task[] }>(
    `${baseURL}/projects/${projectId}/tasks/ai-breakdown`,
    data,
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const aiSearchTasks = async (
  projectId: string,
  data: { query: string },
  token: string
): Promise<{ success: boolean; data: Task[]; message: string; filtersApplied: any }> => {
  const res = await axios.post<{ success: boolean; data: Task[]; message: string; filtersApplied: any }>(
    `${baseURL}/projects/${projectId}/tasks/ai-search`,
    data,
    {
      headers: headers(token),
    }
  );

  return res.data;
};