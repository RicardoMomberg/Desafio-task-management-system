import { PrismaClient } from '@prisma/client';
import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        name: user.name,
        updatedAt: user.updatedAt
      }
    });

    return this.toDomain(updated);
  }

  private toDomain(prismaUser: any): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.passwordHash,
      prismaUser.name,
      prismaUser.createdAt,
      prismaUser.updatedAt
    );
  }
}