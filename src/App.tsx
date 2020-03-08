import React, { useCallback } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Auth0Provider, useAuth0 } from './providers/Auth0';
import { ApolloProvider } from './providers/Apollo';
import { auth0Config } from './constants/config';
import { LoadingScreen } from './components/LoadingScreen';
import { PostsIndex } from './pages/PostsIndex';

const AuthenticatedPages = () => (
  <ApolloProvider>
    <Route path="/">
      <PostsIndex />
    </Route>
  </ApolloProvider>
);

const UnAuthenticatedPages = ({ onClickLogin }: { onClickLogin: ReturnType<typeof useAuth0>['loginWithRedirect'] }) => {
  const handleClickLogin = useCallback(() => onClickLogin({ returnTo: window.location.origin }), [onClickLogin]);

  return <Button onClick={handleClickLogin}>ログインしてないよ</Button>;
};

const Pages = () => {
  const { authenticated, loginWithRedirect, loading } = useAuth0();

  return loading ? (
    <LoadingScreen />
  ) : authenticated ? (
    <AuthenticatedPages />
  ) : (
    <UnAuthenticatedPages onClickLogin={loginWithRedirect} />
  );
};

export const App = () => (
  <BrowserRouter>
    <Auth0Provider
      domain={auth0Config.domain}
      client_id={auth0Config.clientId}
      redirect_uri={window.location.origin}
      audience={auth0Config.audience}
    >
      <Pages />
    </Auth0Provider>
  </BrowserRouter>
);
