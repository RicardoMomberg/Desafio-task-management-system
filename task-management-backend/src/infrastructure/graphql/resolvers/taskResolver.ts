import { GraphQLContext } from '../context';
import { CreateTaskUseCase } from '@application/use-cases/task/CreateTask';
import { UpdateTaskUseCase } from '@application/use-cases/task/UpdateTask';
import { DeleteTaskUseCase } from '@application/use-cases/task/DeleteTask';
import { GetTasksUseCase } from '@application/use-cases/task/GetTasks';
import { GetTaskByIdUseCase } from '@application/use-cases/task/GetTaskById';
import { GraphQLError } from 'graphql';

// Event names for subscriptions
const TASK_CREATED = 'TASK_CREATED';
const TASK_UPDATED = 'TASK_UPDATED';
const TASK_DELETED = 'TASK_DELETED';

export const taskResolvers = {
  Query: {
    task: async (_: any, { id }: any, context: GraphQLContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const useCase = new GetTaskByIdUseCase(context.taskRepository);

      try {
        return await useCase.execute(id, context.currentUser.userId);
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'NOT_FOUND' }
        });
      }
    },

    tasks: async (_: any, { filters, pagination }: any, context: GraphQLContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const useCase = new GetTasksUseCase(context.taskRepository);

      const taskFilters = {
        userId: context.currentUser.userId,
        status: filters?.status
      };

      const paginationOptions = {
        limit: Math.min(pagination?.limit || 20, 100), // Max 100
        offset: pagination?.offset || 0
      };

      return await useCase.execute(taskFilters, paginationOptions);
    }
  },

  Mutation: {
    createTask: async (_: any, { input }: any, context: GraphQLContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const useCase = new CreateTaskUseCase(context.taskRepository);

      try {
        const task = await useCase.execute({
          ...input,
          userId: context.currentUser.userId
        });

        // Publicar evento para subscriptions
        context.pubsub.publish(TASK_CREATED, {
          taskCreated: task,
          userId: context.currentUser.userId
        });

        return task;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
    },

    updateTask: async (_: any, { id, input }: any, context: GraphQLContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const useCase = new UpdateTaskUseCase(context.taskRepository);

      try {
        const task = await useCase.execute(id, context.currentUser.userId, input);

        // Publicar evento
        context.pubsub.publish(TASK_UPDATED, {
          taskUpdated: task,
          userId: context.currentUser.userId
        });

        return task;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'FORBIDDEN' }
        });
      }
    },

    deleteTask: async (_: any, { id }: any, context: GraphQLContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const useCase = new DeleteTaskUseCase(context.taskRepository);

      try {
        await useCase.execute(id, context.currentUser.userId);

        // Publicar evento
        context.pubsub.publish(TASK_DELETED, {
          taskDeleted: id,
          userId: context.currentUser.userId
        });

        return true;
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'FORBIDDEN' }
        });
      }
    }
  },

  Subscription: {
    taskCreated: {
      subscribe: (_: any, { userId }: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator([TASK_CREATED]);
      },
      resolve: (payload: any) => payload.taskCreated
    },

    taskUpdated: {
      subscribe: (_: any, { userId }: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator([TASK_UPDATED]);
      },
      resolve: (payload: any) => payload.taskUpdated
    },

    taskDeleted: {
      subscribe: (_: any, { userId }: any, context: GraphQLContext) => {
        return context.pubsub.asyncIterator([TASK_DELETED]);
      },
      resolve: (payload: any) => payload.taskDeleted
    }
  },

  Task: {
    user: async (parent: any, _: any, context: GraphQLContext) => {
      return await context.userRepository.findById(parent.userId);
    }
  }
};