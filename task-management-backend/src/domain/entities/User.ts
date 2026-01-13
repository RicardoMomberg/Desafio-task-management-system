export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public readonly passwordHash: string,
    public name: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Invalid email format');
    }
    if (this.name.length < 2) {
      throw new Error('Name must have at least 2 characters');
    }
  }

  updateEmail(newEmail: string): void {
    this.email = newEmail;
    this.validate();
    this.updatedAt = new Date();
  }

  updateName(newName: string): void {
    this.name = newName;
    this.validate();
    this.updatedAt = new Date();
  }
}