import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import rateLimit from 'express-rate-limit';
import { PubSub } from 'graphql-subscriptions';

import { resolvers } from '@infrastructure/graphql/resolvers';
import { GraphQLContext } from '@infrastructure/graphql/context';
import { getPrismaClient } from '@infrastructure/database/prisma-client';
import { PrismaTaskRepository } from '@infrastructure/database/repositories/PrismaTaskRepository';
import { PrismaUserRepository } from '@infrastructure/database/repositories/PrismaUserRepository';
import { JwtService } from '@infrastructure/security/JwtService';
import { PasswordHasher } from '@infrastructure/security/PasswordHasher';

const PORT = process.env.PORT || 4000;

async function startServer() {
  // Criar Express app
  const app = express();
  const httpServer = createServer(app);

  // Configurar CORS
  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
  };

  // Middlewares de segurança
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false
  }));
  
  app.use(cors(corsOptions));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por IP
    message: 'Too many requests from this IP, please try again later'
  });

  app.use('/graphql', limiter);

  // Carregar schema GraphQL
  const typeDefs = readFileSync(
    join(__dirname, '../infrastructure/graphql/schema.graphql'),
    'utf-8'
  );

  // Criar schema executável
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  // Inicializar dependências
  const prisma = getPrismaClient();
  const taskRepository = new PrismaTaskRepository(prisma);
  const userRepository = new PrismaUserRepository(prisma);
  const jwtService = new JwtService();
  const passwordHasher = new PasswordHasher();
  const pubsub = new PubSub();

  // WebSocket server para subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  });

  // Setup WebSocket subscriptions
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        // Extrair token do connectionParams
        const token = ctx.connectionParams?.authorization as string;
        
        let currentUser = undefined;
        
        if (token) {
          try {
            const decoded = jwtService.verifyAccessToken(token.replace('Bearer ', ''));
            currentUser = decoded;
          } catch (error) {
            console.log('WebSocket authentication failed:', error);
          }
        }

        return {
          prisma,
          taskRepository,
          userRepository,
          jwtService,
          passwordHasher,
          pubsub,
          currentUser
        } as GraphQLContext;
      }
    },
    wsServer
  );

  // Criar Apollo Server
  const server = new ApolloServer<GraphQLContext>({
    schema,
    plugins: [
      // Proper shutdown for HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),
      
      // Proper shutdown for WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }
    ],
    formatError: (formattedError, error) => {
      // Log errors (em produção, use um logger apropriado)
      console.error('GraphQL Error:', error);
      
      // Não expor detalhes internos em produção
      if (process.env.NODE_ENV === 'production') {
        if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
          return {
            message: 'Internal server error',
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          };
        }
      }
      
      return formattedError;
    }
  });

  await server.start();

  // Middleware do Apollo Server
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GraphQLContext> => {
        // Extrair token do header Authorization
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        let currentUser = undefined;
        
        if (token) {
          try {
            const decoded = jwtService.verifyAccessToken(token);
            currentUser = decoded;
          } catch (error) {
            // Token inválido ou expirado - continua sem autenticação
          }
        }

        return {
          req,
          res,
          prisma,
          taskRepository,
          userRepository,
          jwtService,
          passwordHasher,
          pubsub,
          currentUser
        };
      }
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Iniciar servidor
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, resolve);
  });

  console.log('🚀 Server is running!');
  console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}/graphql`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
}

// Iniciar servidor
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});