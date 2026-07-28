import type { TaskPriority, TaskStatus } from "../Types/TaskType";
import type { User } from "./IUser";

export interface CreateTaskData {
  title: string;
  description: string;
  dueDate: Date;
  assignee: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: Date;
  assignee?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface IStatusHistory {
  oldStatus?: string;
  newStatus: string;
  changedBy: User;
  changedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  creator: User;
  assignee: User;
  project: string;
  statusHistory?: IStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  data: Task;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
}

export interface MessageResponse {
  success: boolean;
  message: string;
}