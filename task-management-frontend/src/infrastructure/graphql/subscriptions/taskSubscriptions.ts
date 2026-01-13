import { gql } from '@apollo/client';

export const TASK_CREATED_SUBSCRIPTION = gql`
  subscription OnTaskCreated($userId: ID!) {
    taskCreated(userId: $userId) {
      id
      title
      description
      status
      userId
      createdAt
    }
  }
`;

export const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription OnTaskUpdated($userId: ID!) {
    taskUpdated(userId: $userId) {
      id
      title
      description
      status
      userId
      updatedAt
    }
  }
`;

export const TASK_DELETED_SUBSCRIPTION = gql`
  subscription OnTaskDeleted($userId: ID!) {
    taskDeleted(userId: $userId)
  }
`;