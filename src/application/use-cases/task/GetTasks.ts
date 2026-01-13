import { ITaskRepository, TaskFilters, PaginationOptions, TaskConnection } from '@domain/repositories/ITaskRepository';

export class GetTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(filters: TaskFilters, pagination: PaginationOptions): Promise<TaskConnection> {
    return await this.taskRepository.findByUserId(filters, pagination);
  }
}