import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($filters: TaskFiltersInput, $pagination: PaginationInput) {
    tasks(filters: $filters, pagination: $pagination) {
      tasks {
        id
        title
        description
        status
        userId
        createdAt
        updatedAt
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      userId
      user {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;