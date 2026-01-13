import { Task } from '@domain/entities/Task';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { TaskStatus } from '@domain/value-objects/TaskStatus';
import { CreateTaskDTO } from '@application/dto/CreateTaskDTO';
import { randomUUID } from 'crypto';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<Task> {
    const task = new Task(
      randomUUID(),
      dto.title,
      dto.description || null,
      dto.status || TaskStatus.TODO,
      dto.userId,
      new Date(),
      new Date()
    );

    return await this.taskRepository.create(task);
  }
}