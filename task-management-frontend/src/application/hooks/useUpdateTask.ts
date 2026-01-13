import { useMutation } from '@apollo/client';
import { UPDATE_TASK } from '../../infrastructure/graphql/mutations/taskMutations';
import { TaskStatus } from '../../domain/enums/TaskStatus';

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export const useUpdateTask = () => {
  const [updateTaskMutation, { loading, error }] = useMutation(UPDATE_TASK);

  const updateTask = async (id: string, input: UpdateTaskInput) => {
    try {
      const { data } = await updateTaskMutation({
        variables: { id, input }
      });
      return data?.updateTask;
    } catch (err) {
      throw err;
    }
  };

  return {
    updateTask,
    loading,
    error
  };
};
