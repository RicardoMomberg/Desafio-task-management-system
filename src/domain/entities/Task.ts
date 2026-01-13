import { TaskStatus } from '../value-objects/TaskStatus';

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public status: TaskStatus,
    public readonly userId: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (this.title.length > 200) {
      throw new Error('Title must be less than 200 characters');
    }
  }

  updateTitle(newTitle: string): void {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  updateDescription(newDescription: string | null): void {
    this.description = newDescription;
    this.updatedAt = new Date();
  }

  changeStatus(newStatus: TaskStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  isOwnedBy(userId: string): boolean {
    return this.userId === userId;
  }
}