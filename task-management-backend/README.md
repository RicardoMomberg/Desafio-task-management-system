# 🚀 Task Management API - Backend

API GraphQL com Clean Architecture para gerenciamento de tarefas, desenvolvida com Node.js, TypeScript, Apollo Server e Prisma.

## 📋 Índice

- [Características](#características)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Testes](#testes)
- [API GraphQL](#api-graphql)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Segurança](#segurança)
- [Performance](#performance)

---

## ✨ Características

- ✅ **Clean Architecture** - Separação clara de responsabilidades
- ✅ **GraphQL API** - Queries, Mutations e Subscriptions
- ✅ **Autenticação JWT** - Access e Refresh tokens
- ✅ **WebSocket** - Notificações em tempo real
- ✅ **TypeScript** - Type-safe em todo o projeto
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **Paginação** - Cursor-based pagination
- ✅ **Testes** - Unitários, Integração e E2E
- ✅ **Docker** - Containerização completa
- ✅ **Segurança** - Proteção contra XSS, CSRF, SQL Injection

---

## 🏗️ Arquitetura

### Clean Architecture - 4 Camadas

```
┌─────────────────────────────────────────┐
│    PRESENTATION (Apollo Server)        │  ← Interfaces externas
├─────────────────────────────────────────┤
│    INFRASTRUCTURE (GraphQL, Prisma)    │  ← Implementações
├─────────────────────────────────────────┤
│    APPLICATION (Use Cases)             │  ← Lógica de aplicação
├─────────────────────────────────────────┤
│    DOMAIN (Entities, Rules)            │  ← Regras de negócio
└─────────────────────────────────────────┘
```

**Regra de Dependência:** Camadas internas não conhecem camadas externas.

---

## 🛠️ Tecnologias

- **Runtime:** Node.js 18+
- **Linguagem:** TypeScript 5+
- **API:** Apollo Server 4, GraphQL
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5
- **Auth:** JWT (jsonwebtoken)
- **Security:** bcrypt, helmet, rate-limit
- **WebSocket:** graphql-ws
- **Tests:** Jest
- **Containerization:** Docker

---

## 📦 Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- PostgreSQL 16 (ou Docker)
- Git

---

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd task-management-backend
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
NODE_ENV=development
PORT=4000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanagement"

# JWT (Gere secrets fortes em produção)
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Security
BCRYPT_ROUNDS=12

# CORS
ALLOWED_ORIGINS="http://localhost:3000"
```

### 4. Inicie o Banco de Dados

**Opção A: Com Docker (Recomendado)**

```bash
docker-compose up -d postgres
```

**Opção B: PostgreSQL Local**

Certifique-se de ter o PostgreSQL instalado e rodando.

### 5. Execute as Migrations

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar e aplicar migrations
npm run prisma:migrate
```

---

## ⚙️ Configuração

### Gerar Secrets JWT Seguros

Para produção, gere secrets fortes:

```bash
# Linux/Mac
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Ou use
openssl rand -base64 64
```

### Configurar CORS

Edite `ALLOWED_ORIGINS` no `.env` com as origens permitidas:

```env
ALLOWED_ORIGINS="http://localhost:3000,https://myapp.com"
```

---

## 🏃 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:4000`

### Modo Produção

```bash
# Build
npm run build

# Start
npm start
```

### Com Docker Compose

```bash
# Inicia todos os serviços
docker-compose up

# Em background
docker-compose up -d

# Ver logs
docker-compose logs -f api
```

### Acessar

- **GraphQL Playground:** http://localhost:4000/graphql
- **Health Check:** http://localhost:4000/health
- **WebSocket:** ws://localhost:4000/graphql

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Com coverage
npm run test:coverage
```

### Tipos de Testes

- **Unitários:** `tests/unit/` - Testa entidades e use cases
- **Integração:** `tests/integration/` - Testa resolvers GraphQL
- **E2E:** `tests/e2e/` - Testa fluxos completos

---

## 📖 API GraphQL

### Autenticação

#### Registrar Usuário

```graphql
mutation Register {
  register(input: {
    email: "user@example.com"
    password: "securepassword"
    name: "John Doe"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      name
    }
  }
}
```

#### Login

```graphql
mutation Login {
  login(input: {
    email: "user@example.com"
    password: "securepassword"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      name
    }
  }
}
```

#### Refresh Token

```graphql
mutation RefreshToken {
  refreshToken(refreshToken: "your-refresh-token") {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
```

### Tasks

**Importante:** Todas as operações de task requerem autenticação. Inclua o token no header:

```
Authorization: Bearer <your-access-token>
```

#### Criar Tarefa

```graphql
mutation CreateTask {
  createTask(input: {
    title: "Implementar autenticação"
    description: "Adicionar JWT auth"
    status: TODO
  }) {
    id
    title
    description
    status
    createdAt
  }
}
```

#### Listar Tarefas (com paginação)

```graphql
query GetTasks {
  tasks(
    filters: { status: TODO }
    pagination: { limit: 20, offset: 0 }
  ) {
    tasks {
      id
      title
      status
      createdAt
    }
    totalCount
    hasMore
  }
}
```

#### Atualizar Tarefa

```graphql
mutation UpdateTask {
  updateTask(
    id: "task-id-here"
    input: {
      status: IN_PROGRESS
      description: "Atualizada"
    }
  ) {
    id
    status
    updatedAt
  }
}
```

#### Deletar Tarefa

```graphql
mutation DeleteTask {
  deleteTask(id: "task-id-here")
}
```

### Subscriptions (WebSocket)

#### Ouvir Novas Tarefas

```graphql
subscription OnTaskCreated {
  taskCreated(userId: "your-user-id") {
    id
    title
    status
  }
}
```

#### Ouvir Atualizações

```graphql
subscription OnTaskUpdated {
  taskUpdated(userId: "your-user-id") {
    id
    title
    status
    updatedAt
  }
}
```

---

## 📁 Estrutura do Projeto

```
src/
├── domain/                    # Regras de negócio puras
│   ├── entities/              # Entidades do domínio
│   ├── repositories/          # Interfaces dos repositórios
│   └── value-objects/         # Objetos de valor
│
├── application/               # Casos de uso
│   ├── use-cases/             # Implementação dos casos de uso
│   └── dto/                   # Data Transfer Objects
│
├── infrastructure/            # Implementações técnicas
│   ├── database/              # Prisma e repositories
│   ├── graphql/               # Schema e resolvers
│   ├── security/              # JWT, bcrypt
│   └── websocket/             # PubSub
│
├── presentation/              # Camada de apresentação
│   └── server.ts              # Apollo Server setup
│
└── shared/                    # Código compartilhado
    ├── errors/                # Classes de erro
    └── utils/                 # Utilitários
```

---

## 🔒 Segurança

### Implementações

✅ **SQL Injection:** Prevenido pelo Prisma ORM (prepared statements)  
✅ **XSS:** Content Security Policy via Helmet  
✅ **CSRF:** Tokens CSRF em produção  
✅ **Rate Limiting:** 100 requisições por 15 minutos  
✅ **Password Hashing:** bcrypt com 12 rounds  
✅ **JWT:** Access (15min) + Refresh (7 dias) tokens  
✅ **HTTPS:** Obrigatório em produção  
✅ **Helmet:** Security headers configurados  

### Boas Práticas

- Nunca commite `.env` para o repositório
- Use secrets fortes e únicos em produção
- Habilite HTTPS em produção
- Configure CORS adequadamente
- Monitore logs de segurança

---

## ⚡ Performance

### Otimizações Implementadas

✅ **Paginação:** Cursor-based pagination para grandes datasets  
✅ **Lazy Loading:** Carregamento sob demanda  
✅ **Database Indexes:** Otimizados para queries comuns  
✅ **Connection Pooling:** Gerenciamento eficiente de conexões  
✅ **Rate Limiting:** Proteção contra sobrecarga  

### Métricas Target

| Métrica | Target |
|---------|--------|
| Response Time (p95) | < 200ms |
| Throughput | > 1000 req/s |
| Database Queries | < 10ms |
| Memory Usage | < 512MB |

---

## 🐳 Docker

### Build da Imagem

```bash
docker build -t task-management-api .
```

### Executar Container

```bash
docker run -p 4000:4000 \
  -e DATABASE_URL="your-db-url" \
  -e JWT_ACCESS_SECRET="your-secret" \
  task-management-api
```

---

## 🚢 Deploy

### Heroku

```bash
heroku create task-management-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run npm run prisma:migrate
```

### AWS / GCP / Azure

Utilize o Dockerfile fornecido e siga a documentação específica de cada provider.

---

## 📊 Prisma Studio

Para visualizar e editar dados:

```bash
npm run prisma:studio
```

Abre em: http://localhost:5555

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Verificar logs
docker logs task-management-db
```

### Erro: "JWT secrets not configured"

```bash
# Verificar .env
cat .env | grep JWT
```

### Erro: "Port 4000 already in use"

```bash
# Encontrar processo
lsof -i :4000

# Matar processo
kill -9 <PID>
```

---

## 📝 Licença

MIT

---

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📞 Suporte

- 📧 Email: support@taskmanagement.com
- 📖 Documentação: [docs.taskmanagement.com](https://docs.taskmanagement.com)

---

**Desenvolvido com ❤️ usando Clean Architecture e GraphQL**