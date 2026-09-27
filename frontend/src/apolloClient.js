import { ApolloClient, InMemoryCache } from '@apollo/client';

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql';

const client = new ApolloClient({
  uri: graphqlUrl,
  cache: new InMemoryCache(),
});

export default client;
