import { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_TASKS } from '../../infrastructure/graphql/queries/taskQueries';
import { 
  TASK_CREATED_SUBSCRIPTION,
  TASK_UPDATED_SUBSCRIPTION,
  TASK_DELETED_SUBSCRIPTION 
} from '../../infrastructure/graphql/subscriptions/taskSubscriptions';
import { Task, TaskFilters, TaskConnection } from '../../domain/models/Task';
import { tokenService } from '../services/tokenService';

interface UseTasksOptions {
  filters?: TaskFilters;
  limit?: number;
}

export const useTasks = (options: UseTasksOptions = {}) => {
  const { filters, limit = 20 } = options;
  const [offset, setOffset] = useState(0);
  
  const userId = tokenService.getUserId();

  const { data, loading, error, fetchMore, refetch } = useQuery<{
    tasks: TaskConnection;
  }>(GET_TASKS, {
    variables: {
      filters,
      pagination: {
        limit,
        offset
      }
    },
    fetchPolicy: 'cache-and-network'
  });

  // Real-time subscriptions
  useSubscription(TASK_CREATED_SUBSCRIPTION, {
    variables: { userId },
    onData: () => {
      refetch();
    },
    skip: !userId
  });

  useSubscription(TASK_UPDATED_SUBSCRIPTION, {
    variables: { userId },
    onData: () => {
      refetch();
    },
    skip: !userId
  });

  useSubscription(TASK_DELETED_SUBSCRIPTION, {
    variables: { userId },
    onData: () => {
      refetch();
    },
    skip: !userId
  });

  const loadMore = async () => {
    if (!data?.tasks.hasMore) return;

    const newOffset = offset + limit;
    
    await fetchMore({
      variables: {
        filters,
        pagination: {
          limit,
          offset: newOffset
        }
      }
    });

    setOffset(newOffset);
  };

  return {
    tasks: data?.tasks.tasks || [],
    totalCount: data?.tasks.totalCount || 0,
    hasMore: data?.tasks.hasMore || false,
    loading,
    error,
    loadMore,
    refetch
  };
};