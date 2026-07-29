import type { ProjectCreator, ProjectMember,  } from "../Types/ProjectType";

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
}

export interface AddMemberData {
  userId: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  creator: ProjectCreator;
  members: ProjectMember[];
  totalTasks: number;
  completedTasks: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectResponse {
  success: boolean;
  message?: string;
  data: Project;
}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
}