import React from 'react';
import { Task } from '../../../domain/models/Task';
import { TaskCard } from './TaskCard';
import { Loading } from '../common/Loading';
import { AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error?: any;
  hasMore: boolean;
  onLoadMore: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  hasMore,
  onLoadMore,
  onEdit,
  onDelete
}) => {
  if (loading && tasks.length === 0) {
    return <Loading message="Carregando tarefas..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg font-medium text-gray-900">Erro ao carregar tarefas</p>
        <p className="text-sm text-gray-600 mt-1">{error.message}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <p className="text-lg font-medium text-gray-900">Nenhuma tarefa encontrada</p>
        <p className="text-sm text-gray-600 mt-1">
          Crie sua primeira tarefa para começar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </div>
  );
};