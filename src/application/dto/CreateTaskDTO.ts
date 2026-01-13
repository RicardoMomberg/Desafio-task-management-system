import { TaskStatus } from '@domain/value-objects/TaskStatus';

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  userId: string;
}