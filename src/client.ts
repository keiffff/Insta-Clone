import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpUri = 'https://insta-clone-sample.herokuapp.com/v1/graphql';
const wsUri = httpUri.replace(/^https?/, 'ws');
const uploadUri = 'https://image-processor.now.sh';

const httpLink = new HttpLink({ uri: httpUri });
const wsLink = new WebSocketLink({ uri: wsUri, options: { reconnect: true } });
const uploadLink = createUploadLink({
  uri: uploadUri,
  headers: {
    'keep-alive': 'true',
  },
});

const uploadOrHttpLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      (definition.kind === 'OperationDefinition' &&
        definition.operation === 'mutation' &&
        definition.name?.value === 'uploadFile') ||
      false
    );
  },
  uploadLink,
  httpLink,
);

// subscriptionを発行する際にはWebSocketで接続、それ以外はHTTPで接続するための設定
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  uploadOrHttpLink,
);

const inMemoryCache = new InMemoryCache();

export const client = new ApolloClient({ link, cache: inMemoryCache });
