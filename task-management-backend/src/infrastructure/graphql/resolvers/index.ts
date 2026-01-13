import { GraphQLScalarType, Kind } from 'graphql';
import { authResolvers } from './authResolver';
import { taskResolvers } from './taskResolver';

// DateTime scalar
const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
});

export const resolvers = {
  DateTime: dateTimeScalar,
  
  Query: {
    ...authResolvers.Query,
    ...taskResolvers.Query
  },
  
  Mutation: {
    ...authResolvers.Mutation,
    ...taskResolvers.Mutation
  },
  
  Subscription: {
    ...taskResolvers.Subscription
  },

  Task: taskResolvers.Task
};