import { ITaskRepository } from '@domain/repositories/ITaskRepository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    if (!task.isOwnedBy(userId)) {
      throw new Error('Unauthorized: You can only delete your own tasks');
    }

    await this.taskRepository.delete(taskId);
  }
}