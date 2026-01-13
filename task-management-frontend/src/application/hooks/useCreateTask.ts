import { useMutation } from '@apollo/client';
import { CREATE_TASK } from '../../infrastructure/graphql/mutations/taskMutations';
import { GET_TASKS } from '../../infrastructure/graphql/queries/taskQueries';
import { TaskStatus } from '../../domain/enums/TaskStatus';

interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export const useCreateTask = () => {
  const [createTaskMutation, { loading, error }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    awaitRefetchQueries: true
  });

  const createTask = async (input: CreateTaskInput) => {
    try {
      const { data } = await createTaskMutation({
        variables: { input }
      });
      return data?.createTask;
    } catch (err) {
      throw err;
    }
  };

  return {
    createTask,
    loading,
    error
  };
};