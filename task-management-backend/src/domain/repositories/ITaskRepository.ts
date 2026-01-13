import { Task } from '../entities/Task';
import { TaskStatus } from '../value-objects/TaskStatus';

export interface TaskFilters {
  userId: string;
  status?: TaskStatus;
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface TaskConnection {
  tasks: Task[];
  totalCount: number;
  hasMore: boolean;
}

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByUserId(filters: TaskFilters, pagination: PaginationOptions): Promise<TaskConnection>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
}