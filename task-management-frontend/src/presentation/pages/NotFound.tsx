import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Página não encontrada
        </h2>
        <p className="mt-2 text-gray-600">
          A página que você está procurando não existe.
        </p>
        <Button
          onClick={() => navigate('/dashboard')}
          className="mt-8"
        >
          <Home className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
};