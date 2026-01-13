import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from '@infrastructure/graphql/resolvers';
import { GraphQLContext } from '@infrastructure/graphql/context';

describe('Task Resolver Integration', () => {
  let server: ApolloServer<GraphQLContext>;
  let mockContext: Partial<GraphQLContext>;

  beforeEach(() => {
    const typeDefs = readFileSync(
      join(__dirname, '../../../src/infrastructure/graphql/schema.graphql'),
      'utf-8'
    );

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    });

    server = new ApolloServer<GraphQLContext>({
      schema
    });

    mockContext = {
      currentUser: {
        userId: 'user-123',
        email: 'test@example.com'
      },
      taskRepository: {
        create: jest.fn(),
        findById: jest.fn(),
        findByUserId: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      } as any,
      userRepository: {
        findById: jest.fn()
      } as any
    };
  });

  it('should create a task', async () => {
    const mutation = `
      mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
          id
          title
          status
        }
      }
    `;

    const mockTask = {
      id: 'task-123',
      title: 'Test Task',
      status: 'TODO',
      userId: 'user-123',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (mockContext.taskRepository!.create as jest.Mock).mockResolvedValue(mockTask);

    const response = await server.executeOperation(
      {
        query: mutation,
        variables: {
          input: {
            title: 'Test Task'
          }
        }
      },
      {
        contextValue: mockContext as GraphQLContext
      }
    );

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.createTask).toMatchObject({
        title: 'Test Task',
        status: 'TODO'
      });
    }
  });

  it('should require authentication', async () => {
    const query = `
      query {
        tasks {
          tasks {
            id
          }
        }
      }
    `;

    const unauthenticatedContext = {
      ...mockContext,
      currentUser: undefined
    };

    const response = await server.executeOperation(
      { query },
      { contextValue: unauthenticatedContext as GraphQLContext }
    );

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeDefined();
      expect(response.body.singleResult.errors?.[0].extensions?.code).toBe('UNAUTHENTICATED');
    }
  });
});