import { TaskStatus } from '@domain/value-objects/TaskStatus';

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}