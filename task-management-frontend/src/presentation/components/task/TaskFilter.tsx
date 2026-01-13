import React from 'react';
import { TaskStatus } from '../../../domain/enums/TaskStatus';
import { TaskStatusLabels } from '../../../domain/enums/TaskStatus';

interface TaskFilterProps {
  selectedStatus?: TaskStatus;
  onFilterChange: (status?: TaskStatus) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ selectedStatus, onFilterChange }) => {
  const statuses = [
    { value: undefined, label: 'Todas' },
    { value: TaskStatus.TODO, label: TaskStatusLabels[TaskStatus.TODO] },
    { value: TaskStatus.IN_PROGRESS, label: TaskStatusLabels[TaskStatus.IN_PROGRESS] },
    { value: TaskStatus.DONE, label: TaskStatusLabels[TaskStatus.DONE] }
  ];

  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <button
          key={status.label}
          onClick={() => onFilterChange(status.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStatus === status.value
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
};