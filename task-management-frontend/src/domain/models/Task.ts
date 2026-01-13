import { TaskStatus } from '../enums/TaskStatus';
import { User } from './User';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TaskConnection {
  tasks: Task[];
  totalCount: number;
  hasMore: boolean;
}

export interface TaskFilters {
  status?: TaskStatus;
}

export interface TaskPagination {
  limit: number;
  offset: number;
}