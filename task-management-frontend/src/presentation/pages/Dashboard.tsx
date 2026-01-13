import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { useTasks } from '../../application/hooks/useTasks';
import { TaskStatus } from '../../domain/enums/TaskStatus';
import { CheckCircle2, Clock, ListTodo, Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, loading } = useTasks();

  const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO).length;
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const doneTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;

  const stats = [
    {
      label: 'A Fazer',
      value: todoTasks,
      icon: ListTodo,
      color: 'bg-gray-100 text-gray-600'
    },
    {
      label: 'Em Progresso',
      value: inProgressTasks,
      icon: Clock,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Concluídas',
      value: doneTasks,
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Visão geral das suas tarefas
            </p>
          </div>

          <Button onClick={() => navigate('/tasks')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/tasks')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
            >
              <Plus className="h-5 w-5 text-gray-600 mb-2" />
              <p className="font-medium text-gray-900">Criar nova tarefa</p>
              <p className="text-sm text-gray-600">Adicione uma nova tarefa à sua lista</p>
            </button>

            <button
              onClick={() => navigate('/tasks?status=TODO')}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
            >
              <ListTodo className="h-5 w-5 text-gray-600 mb-2" />
              <p className="font-medium text-gray-900">Ver tarefas pendentes</p>
              <p className="text-sm text-gray-600">Visualize todas as tarefas a fazer</p>
            </button>
          </div>
        </div>

        {/* Recent Tasks Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Tarefas Recentes
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tasks')}
            >
              Ver todas
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-600">Carregando...</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-gray-600">
              Nenhuma tarefa encontrada. Crie sua primeira tarefa!
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/tasks')}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-gray-600 truncate">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <span className={`ml-4 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};