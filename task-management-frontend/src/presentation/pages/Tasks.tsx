import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { TaskList } from '../components/task/TaskList';
import { TaskForm } from '../components/task/TaskForm';
import { TaskFilter } from '../components/task/TaskFilter';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useTasks } from '../../application/hooks/useTasks';
import { useCreateTask } from '../../application/hooks/useCreateTask';
import { useUpdateTask } from '../../application/hooks/useUpdateTask';
import { useDeleteTask } from '../../application/hooks/useDeleteTask';
import { Task } from '../../domain/models/Task';
import { TaskStatus } from '../../domain/enums/TaskStatus';
import { Plus } from 'lucide-react';

export const Tasks: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, loading, error, hasMore, loadMore, totalCount } = useTasks({
    filters: { status: selectedStatus }
  });

  const { createTask, loading: creating } = useCreateTask();
  const { updateTask, loading: updating } = useUpdateTask();
  const { deleteTask } = useDeleteTask();

  const handleCreateTask = async (data: any) => {
    try {
      await createTask(data);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;

    try {
      await updateTask(editingTask.id, data);
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(id);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
            <p className="mt-1 text-sm text-gray-600">
              {totalCount} {totalCount === 1 ? 'tarefa' : 'tarefas'} no total
            </p>
          </div>

          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Filters */}
        <TaskFilter
          selectedStatus={selectedStatus}
          onFilterChange={setSelectedStatus}
        />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Criar Nova Tarefa"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={creating}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          title="Editar Tarefa"
        >
          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={handleUpdateTask}
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingTask(null);
              }}
              loading={updating}
            />
          )}
        </Modal>
      </div>
    </Layout>
  );
};