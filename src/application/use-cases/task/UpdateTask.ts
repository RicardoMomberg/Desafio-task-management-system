import { Task } from '@domain/entities/Task';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { UpdateTaskDTO } from '@application/dto/UpdateTaskDTO';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: string, userId: string, dto: UpdateTaskDTO): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    if (!task.isOwnedBy(userId)) {
      throw new Error('Unauthorized: You can only update your own tasks');
    }

    if (dto.title !== undefined) {
      task.updateTitle(dto.title);
    }

    if (dto.description !== undefined) {
      task.updateDescription(dto.description);
    }

    if (dto.status !== undefined) {
      task.changeStatus(dto.status);
    }

    return await this.taskRepository.update(task);
  }
}