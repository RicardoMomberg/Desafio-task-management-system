import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@infrastructure/security/JwtService';
import { PasswordHasher } from '@infrastructure/security/PasswordHasher';
import { PrismaTaskRepository } from '@infrastructure/database/repositories/PrismaTaskRepository';
import { PrismaUserRepository } from '@infrastructure/database/repositories/PrismaUserRepository';
import { PubSub } from 'graphql-subscriptions';

export interface GraphQLContext {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  taskRepository: PrismaTaskRepository;
  userRepository: PrismaUserRepository;
  jwtService: JwtService;
  passwordHasher: PasswordHasher;
  pubsub: PubSub;
  currentUser?: {
    userId: string;
    email: string;
  };
}