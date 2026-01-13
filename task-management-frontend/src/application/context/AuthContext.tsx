import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { User, LoginInput, RegisterInput } from '../../domain/models/Auth';
import { LOGIN, REGISTER } from '../../infrastructure/graphql/mutations/authMutations';
import { GET_ME } from '../../infrastructure/graphql/queries/authQueries';
import { tokenService } from '../services/tokenService';
import { apolloClient } from '../../infrastructure/graphql/client';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Queries e Mutations
  const { data: meData, loading: meLoading } = useQuery(GET_ME, {
    skip: !tokenService.getAccessToken(),
    onError: () => {
      tokenService.clearTokens();
      setUser(null);
    }
  });

  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);

  // Verificar autenticação ao montar
  useEffect(() => {
    const token = tokenService.getAccessToken();
    
    if (!token || tokenService.isTokenExpired(token)) {
      tokenService.clearTokens();
      setLoading(false);
      return;
    }

    if (meData?.me) {
      setUser(meData.me);
    }

    setLoading(false);
  }, [meData]);

  // Login
  const login = async (input: LoginInput) => {
    try {
      const { data } = await loginMutation({
        variables: { input }
      });

      if (data?.login) {
        tokenService.setTokens(
          data.login.accessToken,
          data.login.refreshToken
        );
        setUser(data.login.user);
        
        // Reset Apollo cache
        await apolloClient.resetStore();
      }
    } catch (error) {
      throw error;
    }
  };

  // Register
  const register = async (input: RegisterInput) => {
    try {
      const { data } = await registerMutation({
        variables: { input }
      });

      if (data?.register) {
        tokenService.setTokens(
          data.register.accessToken,
          data.register.refreshToken
        );
        setUser(data.register.user);
        
        await apolloClient.resetStore();
      }
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    tokenService.clearTokens();
    setUser(null);
    apolloClient.clearStore();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || meLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};