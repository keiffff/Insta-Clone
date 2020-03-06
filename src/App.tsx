import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Auth0Provider, useAuth0 } from './providers/Auth0';
import { auth0Config } from './constants/config';
import { PostsIndex } from './pages/PostsIndex';

const Pages = () => {
  const { authenticated, loginWithRedirect } = useAuth0();

  return authenticated ? (
    <Route path="/">
      <PostsIndex />
    </Route>
  ) : (
    <Button onClick={() => loginWithRedirect({ returnTo: window.location.origin })}>ログインしてないよ</Button>
  );
};

export const App = () => (
  <BrowserRouter>
    <Auth0Provider domain={auth0Config.domain} client_id={auth0Config.clientId} redirect_uri={window.location.origin}>
      <Pages />
    </Auth0Provider>
  </BrowserRouter>
);
