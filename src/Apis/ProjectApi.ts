import axios from "axios";

import type {
  CreateProjectSchemaType,
  UpdateProjectSchemaType,
} from "../Utils/Schema/projectSchema";
import { baseURL } from "../Constants/BaseUrl";
import type { MessageResponse, ProjectResponse, ProjectsResponse } from "../Interfaces/Iproject";

const headers = (token: string) => ({
  "Content-Type": "application/json",
  "x-client-user-agent": navigator.userAgent,
  authentication: `bearer ${token}`,
});

export const createProject = async (
  data: CreateProjectSchemaType,
  token: string
): Promise<ProjectResponse> => {
  const res = await axios.post<ProjectResponse>(
    `${baseURL}/projects`,
    data,
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const getProjects = async (
  token: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }
): Promise<ProjectsResponse> => {
  const res = await axios.get<ProjectsResponse>(
    `${baseURL}/projects`,
    {
      headers: headers(token),
      params,
    }
  );

  return res.data;
};

export const getProjectById = async (
  id: string,
  token: string
): Promise<ProjectResponse> => {
  const res = await axios.get<ProjectResponse>(
    `${baseURL}/projects/${id}`,
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const updateProject = async (
  id: string,
  data: UpdateProjectSchemaType,
  token: string
): Promise<ProjectResponse> => {
  const res = await axios.put<ProjectResponse>(
    `${baseURL}/projects/${id}`,
    data,
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const deleteProject = async (
  id: string,
  token: string
): Promise<MessageResponse> => {
  const res = await axios.delete<MessageResponse>(
    `${baseURL}/projects/${id}`,
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const addMember = async (
  projectId: string,
  userId: string,
  token: string
): Promise<ProjectResponse> => {
  const res = await axios.post<ProjectResponse>(
    `${baseURL}/projects/${projectId}/members`,
    { userId },
    {
      headers: headers(token),
    }
  );

  return res.data;
};

export const removeMember = async (
  projectId: string,
  userId: string,
  token: string
): Promise<ProjectResponse> => {
  const res = await axios.delete<ProjectResponse>(
    `${baseURL}/projects/${projectId}/members/${userId}`,
    {
      headers: headers(token),
    }
  );

  return res.data;
};