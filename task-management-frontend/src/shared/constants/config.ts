export const config = {
  api: {
    graphqlUrl: process.env.REACT_APP_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql',
    wsUrl: process.env.REACT_APP_GRAPHQL_WS_URL || 'ws://localhost:4000/graphql',
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:4000'
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },
  storage: {
    accessTokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken'
  }
};