import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { App } from './App';

const httpUri = 'https://insta-clone-sample.herokuapp.com/v1/graphql';
const wsUri = httpUri.replace(/^https?/, 'ws');

const httpLink = new HttpLink({ uri: httpUri });
// reconnect: trueを渡すとエラー時に再接続しにいく
const wsLink = new WebSocketLink({ uri: wsUri, options: { reconnect: true } });

// subscriptionを発行する際にはWebSocketで接続、それ以外はHTTPで接続するための設定
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const inMemoryCache = new InMemoryCache();

const client = new ApolloClient({ link, cache: inMemoryCache });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
