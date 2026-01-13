import { CreateTaskUseCase } from '@application/use-cases/task/CreateTask';
import { ITaskRepository } from '@domain/repositories/ITaskRepository';
import { Task } from '@domain/entities/Task';
import { TaskStatus } from '@domain/value-objects/TaskStatus';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    useCase = new CreateTaskUseCase(mockRepository);
  });

  it('should create a task successfully', async () => {
    const input = {
      title: 'New Task',
      description: 'Task description',
      status: TaskStatus.TODO,
      userId: 'user-123'
    };

    const expectedTask = new Task(
      expect.any(String),
      input.title,
      input.description,
      input.status,
      input.userId,
      expect.any(Date),
      expect.any(Date)
    );

    mockRepository.create.mockResolvedValue(expectedTask);

    const result = await useCase.execute(input);

    expect(result.title).toBe(input.title);
    expect(result.description).toBe(input.description);
    expect(result.status).toBe(input.status);
    expect(result.userId).toBe(input.userId);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should create task with default status TODO when not provided', async () => {
    const input = {
      title: 'New Task',
      userId: 'user-123'
    };

    mockRepository.create.mockImplementation(async (task) => task);

    const result = await useCase.execute(input);

    expect(result.status).toBe(TaskStatus.TODO);
  });

  it('should throw error for invalid task data', async () => {
    const input = {
      title: '', // Invalid: empty title
      userId: 'user-123'
    };

    await expect(useCase.execute(input)).rejects.toThrow();
  });
});
