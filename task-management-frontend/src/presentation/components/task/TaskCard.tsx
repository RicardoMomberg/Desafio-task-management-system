import React from 'react';
import { Trash2, Edit, Clock } from 'lucide-react';
import { Task } from '../../../domain/models/Task';
import { TaskStatusColors, TaskStatusLabels } from '../../../domain/enums/TaskStatus';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-sm text-gray-600">
              {task.description}
            </p>
          )}
        </div>

        <span className={`ml-4 px-2.5 py-1 rounded-full text-xs font-medium ${TaskStatusColors[task.status]}`}>
          {TaskStatusLabels[task.status]}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5 mr-1" />
          {format(new Date(task.createdAt), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};