import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './infrastructure/graphql/client';
import { AuthProvider } from './application/context/AuthContext';
import { AppRoutes } from './presentation/routes/AppRoutes';
import { ErrorBoundary } from './presentation/components/common/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;