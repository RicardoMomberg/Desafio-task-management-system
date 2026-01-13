import { PrismaClient } from '@prisma/client';
import { Task } from '@domain/entities/Task';
import { TaskStatus } from '@domain/value-objects/TaskStatus';
import { ITaskRepository, TaskFilters, PaginationOptions, TaskConnection } from '@domain/repositories/ITaskRepository';

export class PrismaTaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaClient) {}

  async create(task: Task): Promise<Task> {
    const created = await this.prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.userId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id }
    });

    if (!task) return null;

    return this.toDomain(task);
  }

  async findByUserId(
    filters: TaskFilters,
    pagination: PaginationOptions
  ): Promise<TaskConnection> {
    const where: any = { userId: filters.userId };
    
    if (filters.status) {
      where.status = filters.status;
    }

    // Buscar tasks com paginação
    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: pagination.limit + 1, // +1 para verificar se há mais
      skip: pagination.offset
    });

    // Contar total
    const totalCount = await this.prisma.task.count({ where });

    // Verificar se há mais resultados
    const hasMore = tasks.length > pagination.limit;
    
    // Remover o item extra se houver
    const resultTasks = hasMore ? tasks.slice(0, -1) : tasks;

    return {
      tasks: resultTasks.map(t => this.toDomain(t)),
      totalCount,
      hasMore
    };
  }

  async update(task: Task): Promise<Task> {
    const updated = await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        updatedAt: task.updatedAt
      }
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id }
    });
  }

  private toDomain(prismaTask: any): Task {
    return new Task(
      prismaTask.id,
      prismaTask.title,
      prismaTask.description,
      prismaTask.status as TaskStatus,
      prismaTask.userId,
      prismaTask.createdAt,
      prismaTask.updatedAt
    );
  }
}