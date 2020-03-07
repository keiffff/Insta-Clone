import React, { ReactNode, useState, useEffect } from 'react';
import { ApolloProvider as ApolloProviderOrigin } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { gqlEndpoints } from '../constants/config';
import { useAuth0 } from './Auth0';

type Props = {
  children: ReactNode;
};

const wsUri = gqlEndpoints.hasura.replace(/^https?/, 'wss');
const httpLink = new HttpLink({ uri: gqlEndpoints.hasura });
const wsLink = new WebSocketLink({ uri: wsUri, options: { reconnect: true } });
const uploadLink = createUploadLink({
  uri: gqlEndpoints.fileUpload,
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

const terminatingLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  uploadOrHttpLink,
);

const inMemoryCache = new InMemoryCache();

export const ApolloProvider = ({ children }: Props) => {
  const { getTokenSilently } = useAuth0();
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);
  useEffect(() => {
    const initApollo = async () => {
      const token = await getTokenSilently();
      const authLink = setContext((_, { headers }) => ({
        headers: {
          ...(headers ? { ...headers } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }));
      setClient(new ApolloClient({ link: authLink.concat(terminatingLink), cache: inMemoryCache }));
    };
    initApollo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return client ? <ApolloProviderOrigin client={client}>{children}</ApolloProviderOrigin> : null;
};
