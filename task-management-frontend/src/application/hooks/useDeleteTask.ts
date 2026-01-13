import { useMutation } from '@apollo/client';
import { DELETE_TASK } from '../../infrastructure/graphql/mutations/taskMutations';
import { GET_TASKS } from '../../infrastructure/graphql/queries/taskQueries';

export const useDeleteTask = () => {
  const [deleteTaskMutation, { loading, error }] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    awaitRefetchQueries: true
  });

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskMutation({
        variables: { id }
      });
      return true;
    } catch (err) {
      throw err;
    }
  };

  return {
    deleteTask,
    loading,
    error
  };
};