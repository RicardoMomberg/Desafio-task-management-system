import { Task } from '@domain/entities/Task';
import { TaskStatus } from '@domain/value-objects/TaskStatus';

describe('Task Entity', () => {
  describe('Constructor', () => {
    it('should create a valid task', () => {
      const task = new Task(
        '123',
        'Test Task',
        'Description',
        TaskStatus.TODO,
        'user-123',
        new Date(),
        new Date()
      );

      expect(task.id).toBe('123');
      expect(task.title).toBe('Test Task');
      expect(task.status).toBe(TaskStatus.TODO);
    });

    it('should throw error for empty title', () => {
      expect(() => {
        new Task(
          '123',
          '',
          'Description',
          TaskStatus.TODO,
          'user-123',
          new Date(),
          new Date()
        );
      }).toThrow('Title is required');
    });

    it('should throw error for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      
      expect(() => {
        new Task(
          '123',
          longTitle,
          'Description',
          TaskStatus.TODO,
          'user-123',
          new Date(),
          new Date()
        );
      }).toThrow('Title must be less than 200 characters');
    });
  });

  describe('updateTitle', () => {
    it('should update title successfully', () => {
      const task = new Task(
        '123',
        'Old Title',
        null,
        TaskStatus.TODO,
        'user-123',
        new Date(),
        new Date()
      );

      task.updateTitle('New Title');

      expect(task.title).toBe('New Title');
    });

    it('should throw error when updating to empty title', () => {
      const task = new Task(
        '123',
        'Old Title',
        null,
        TaskStatus.TODO,
        'user-123',
        new Date(),
        new Date()
      );

      expect(() => task.updateTitle('')).toThrow('Title cannot be empty');
    });
  });

  describe('changeStatus', () => {
    it('should change status successfully', () => {
      const task = new Task(
        '123',
        'Task',
        null,
        TaskStatus.TODO,
        'user-123',
        new Date(),
        new Date()
      );

      task.changeStatus(TaskStatus.IN_PROGRESS);
      expect(task.status).toBe(TaskStatus.IN_PROGRESS);

      task.changeStatus(TaskStatus.DONE);
      expect(task.status).toBe(TaskStatus.DONE);
    });
  });

  describe('isOwnedBy', () => {
    it('should return true for owner', () => {
      const task = new Task(
        '123',
        'Task',
        null,
        TaskStatus.TODO,
        'user-123',
        new Date(),
        new Date()
      );

      expect(task.isOwnedBy('user-123')).toBe(true);
    });

    it('should return false for non-owner', () => {
      const task = new Task(
        '123',
        'Task',
        null,
        TaskStatus.TODO,
        'user-123',
        new Date(),
        new Date()
      );

      expect(task.isOwnedBy('user-456')).toBe(false);
    });
  });
});