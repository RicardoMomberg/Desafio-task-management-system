import { GraphQLContext } from '../context';
import { RegisterUseCase } from '@application/use-cases/auth/Register';
import { LoginUseCase } from '@application/use-cases/auth/Login';
import { GraphQLError } from 'graphql';

export const authResolvers = {
  Query: {
    me: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const user = await context.userRepository.findById(context.currentUser.userId);
      
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return user;
    }
  },

  Mutation: {
    register: async (_: any, { input }: any, context: GraphQLContext) => {
      const useCase = new RegisterUseCase(
        context.userRepository,
        context.passwordHasher,
        context.jwtService
      );

      try {
        return await useCase.execute(input);
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
    },

    login: async (_: any, { input }: any, context: GraphQLContext) => {
      const useCase = new LoginUseCase(
        context.userRepository,
        context.passwordHasher,
        context.jwtService
      );

      try {
        return await useCase.execute(input);
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
    },

    refreshToken: async (_: any, { refreshToken }: any, context: GraphQLContext) => {
      try {
        // Verificar refresh token
        const payload = context.jwtService.verifyRefreshToken(refreshToken);

        // Buscar usuário
        const user = await context.userRepository.findById(payload.userId);
        
        if (!user) {
          throw new Error('User not found');
        }

        // Gerar novos tokens
        const newAccessToken = context.jwtService.generateAccessToken({
          userId: user.id,
          email: user.email
        });

        const newRefreshToken = context.jwtService.generateRefreshToken({
          userId: user.id
        });

        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user
        };
      } catch (error: any) {
        throw new GraphQLError('Invalid refresh token', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
    }
  }
};
