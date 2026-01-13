🎨 Task Management Frontend
Frontend moderno construído com React, TypeScript, Apollo Client e Tailwind CSS, seguindo princípios de Clean Architecture.
📋 Índice

Características
Tecnologias
Arquitetura
Pré-requisitos
Instalação
Configuração
Executando
Estrutura do Projeto
Funcionalidades
Build para Produção


✨ Características

✅ Clean Architecture - Separação clara de responsabilidades
✅ TypeScript - Type-safe em todo o código
✅ Apollo Client - GraphQL client com cache inteligente
✅ React Hooks - Custom hooks para lógica de negócio
✅ Tailwind CSS - Estilização utilitária moderna
✅ React Hook Form + Zod - Validação de formulários robusta
✅ WebSocket - Atualizações em tempo real
✅ Autenticação JWT - Login seguro com refresh tokens
✅ Responsive Design - Mobile-first approach
✅ Error Boundary - Tratamento de erros gracioso


🛠️ Tecnologias

Framework: React 18
Linguagem: TypeScript 5
GraphQL Client: Apollo Client 3
Roteamento: React Router v6
Formulários: React Hook Form + Zod
Estilização: Tailwind CSS 3
Ícones: Lucide React
Datas: date-fns
WebSocket: graphql-ws


🏗️ Arquitetura
Clean Architecture - 4 Camadas
┌─────────────────────────────────────────┐
│    PRESENTATION (Components, Pages)    │  ← UI e interação
├─────────────────────────────────────────┤
│    APPLICATION (Hooks, Context)        │  ← Lógica de aplicação
├─────────────────────────────────────────┤
│    INFRASTRUCTURE (Apollo, GraphQL)    │  ← Comunicação externa
├─────────────────────────────────────────┤
│    DOMAIN (Models, Enums)              │  ← Modelos e tipos
└─────────────────────────────────────────┘
Fluxo de Dados
User Interaction → Component → Hook → GraphQL → Backend
                     ↓            ↓       ↓
                   State ← Apollo Cache ← Response

📦 Pré-requisitos

Node.js 18 ou superior
npm ou yarn
Backend rodando em http://localhost:4000


🚀 Instalação
1. Clone ou crie o projeto
Se você usou Create React App:
bashnpx create-react-app task-management-frontend --template typescript
cd task-management-frontend
2. Instale as dependências
bashnpm install
Ou instale manualmente:
bash# Apollo Client e GraphQL
npm install @apollo/client graphql graphql-ws

# React Router
npm install react-router-dom

# Formulários e Validação
npm install react-hook-form zod @hookform/resolvers

# UI e Estilo
npm install tailwindcss postcss autoprefixer
npm install lucide-react clsx tailwind-merge

# Utils
npm install date-fns jwt-decode

# Types
npm install -D @types/node
3. Configure Tailwind CSS
bashnpx tailwindcss init -p

⚙️ Configuração
1. Variáveis de Ambiente
Crie o arquivo .env na raiz:
envREACT_APP_GRAPHQL_HTTP_URL=http://localhost:4000/graphql
REACT_APP_GRAPHQL_WS_URL=ws://localhost:4000/graphql
REACT_APP_API_URL=http://localhost:4000
2. Tailwind Config
Edite tailwind.config.js:
javascriptmodule.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
3. Estrutura de Pastas
Crie a estrutura completa:
bashmkdir -p src/{domain,application,infrastructure,presentation,shared}
mkdir -p src/domain/{models,enums}
mkdir -p src/application/{hooks,context,services}
mkdir -p src/infrastructure/graphql/{queries,mutations,subscriptions}
mkdir -p src/presentation/{components,pages,routes}
mkdir -p src/presentation/components/{common,layout,task}
mkdir -p src/shared/{utils,constants}

🏃 Executando
Modo Desenvolvimento
bashnpm start
A aplicação abrirá em http://localhost:3000
Verificar conexão com Backend
Certifique-se de que o backend está rodando:
bash# Em outro terminal
curl http://localhost:4000/health

📁 Estrutura do Projeto
src/
├── domain/                    # 🟦 Modelos e tipos
│   ├── models/
│   │   ├── Task.ts
│   │   ├── User.ts
│   │   └── Auth.ts
│   └── enums/
│       └── TaskStatus.ts
│
├── application/               # 🟩 Lógica de aplicação
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   ├── useCreateTask.ts
│   │   ├── useUpdateTask.ts
│   │   └── useDeleteTask.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   └── services/
│       └── tokenService.ts
│
├── infrastructure/            # 🟨 Comunicação externa
│   └── graphql/
│       ├── client.ts
│       ├── queries/
│       ├── mutations/
│       └── subscriptions/
│
├── presentation/              # 🟥 Interface
│   ├── components/
│   │   ├── common/           # Botões, Inputs, Modal
│   │   ├── layout/           # Header, Layout
│   │   └── task/             # TaskCard, TaskList, TaskForm
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── Tasks.tsx
│   └── routes/
│       ├── AppRoutes.tsx
│       └── PrivateRoute.tsx
│
└── shared/                    # Utilitários
    ├── utils/
    └── constants/

🎯 Funcionalidades
Autenticação

✅ Login com email/senha
✅ Registro de novos usuários
✅ JWT com refresh tokens automático
✅ Logout seguro
✅ Proteção de rotas privadas

Gestão de Tarefas

✅ Criar nova tarefa
✅ Listar tarefas com filtros
✅ Editar tarefa existente
✅ Deletar tarefa
✅ Alterar status (TODO, IN_PROGRESS, DONE)
✅ Paginação automática

Real-time

✅ Notificações quando tarefa é criada
✅ Atualização automática ao editar
✅ Remoção automática ao deletar
✅ Sincronização entre abas/dispositivos

Dashboard

✅ Estatísticas de tarefas
✅ Cards com contadores
✅ Ações rápidas
✅ Preview de tarefas recentes


🔐 Segurança
Implementado

✅ Tokens em localStorage - Com expiração
✅ Refresh token automático - Renovação transparente
✅ Rotas protegidas - PrivateRoute component
✅ Validação client-side - Zod schemas
✅ XSS Protection - React escaping automático
✅ HTTPS ready - Preparado para produção

Boas Práticas

Tokens armazenados com segurança
Validação de formulários robusta
Tratamento de erros gracioso
Logout limpa todos os dados sensíveis


📱 Responsive Design
A aplicação é totalmente responsiva:

Mobile First - Otimizado para dispositivos móveis
Tablet - Layout adaptado para tablets
Desktop - Experiência completa em telas grandes

Breakpoints (Tailwind)

sm: 640px
md: 768px
lg: 1024px
xl: 1280px


🏗️ Build para Produção
Build da Aplicação
bashnpm run build
Isso criará uma pasta build/ otimizada.
Variáveis de Ambiente para Produção
Crie .env.production:
envREACT_APP_GRAPHQL_HTTP_URL=https://sua-api.com/graphql
REACT_APP_GRAPHQL_WS_URL=wss://sua-api.com/graphql
REACT_APP_API_URL=https://sua-api.com
Deploy
Opção 1: Vercel
bashnpm install -g vercel
vercel
Opção 2: Netlify
bashnpm install -g netlify-cli
netlify deploy --prod
Opção 3: Servidor próprio
bashnpm run build

# Servir com nginx, apache, ou servidor Node
npx serve -s build

🧪 Testes
bash# Executar testes
npm test

# Com coverage
npm test -- --coverage

🎨 Personalização
Cores do Tema
Edite tailwind.config.js:
javascripttheme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
      }
    }
  }
}
Ícones
Troque os ícones Lucide em qualquer componente:
tsximport { Check, X, Plus } from 'lucide-react';

🐛 Troubleshooting
Erro: "Cannot connect to GraphQL server"
Verifique se o backend está rodando:
bashcurl http://localhost:4000/health
Erro: "WebSocket connection failed"
Verifique a URL do WebSocket no .env:
envREACT_APP_GRAPHQL_WS_URL=ws://localhost:4000/graphql
Página em branco após build
Verifique o homepage no package.json:
json"homepage": "."

📖 Documentação Adicional

React Docs
Apollo Client
Tailwind CSS
React Router


📝 Licença
MIT

👥 Contribuindo

Fork o projeto
Crie uma branch (git checkout -b feature/AmazingFeature)
Commit suas mudanças (git commit -m 'Add AmazingFeature')
Push para a branch (git push origin feature/AmazingFeature)
Abra um Pull Request


Desenvolvido com ❤️ usando React e Clean Architecture