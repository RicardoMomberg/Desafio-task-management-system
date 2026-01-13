import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { TaskStatus } from '../../../domain/enums/TaskStatus';
import { Task } from '../../../domain/models/Task';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus)
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, loading }) => {
  // Mapear task (se existir) para os defaultValues esperados pelo form.
  // Garantir que description seja string ('' quando null)
  const defaultValues: TaskFormData = task
    ? {
        title: task.title,
        description: task.description ?? '',
        status: task.status
      }
    : {
        title: '',
        description: '',
        status: TaskStatus.TODO
      };

  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues
  });

  // Criar um SubmitHandler tipado explicitamente para o react-hook-form
  const submitHandler: SubmitHandler<TaskFormData> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <Input
        label="Título"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Digite o título da tarefa"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          placeholder="Digite uma descrição (opcional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          {...register('status')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          <option value={TaskStatus.TODO}>A Fazer</option>
          <option value={TaskStatus.IN_PROGRESS}>Em Progresso</option>
          <option value={TaskStatus.DONE}>Concluído</option>
        </select>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {task ? 'Atualizar' : 'Criar'} Tarefa
        </Button>
      </div>
    </form>
  );
};
