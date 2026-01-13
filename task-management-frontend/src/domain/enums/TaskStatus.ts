export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export const TaskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'A Fazer',
  [TaskStatus.IN_PROGRESS]: 'Em Progresso',
  [TaskStatus.DONE]: 'Concluído'
};

export const TaskStatusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.DONE]: 'bg-green-100 text-green-800'
};