import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from './providers/Auth0';
import { ApolloProvider } from './providers/Apollo';
import { auth0Config } from './constants/config';
import { LoadingScreen } from './components/LoadingScreen';
import { PostsIndex } from './pages/PostsIndex';
import { PostComments } from './pages/PostComments';
import { ProfileEdit } from './pages/ProfileEdit';
import { ProfileShow } from './pages/ProfileShow';
import { Layout } from './layouts/Layout';
import { paths } from './constants/paths';

const AuthenticatedPages = () => (
  <ApolloProvider>
    <Layout>
      <Switch>
        <Route path={paths.home} exact>
          <PostsIndex />
        </Route>
        <Route path={paths.postComments}>
          <PostComments />
        </Route>
        <Route path={paths.profileShow} exact>
          <ProfileShow />
        </Route>
        <Route path={paths.profileEdit}>
          <ProfileEdit />
        </Route>
      </Switch>
    </Layout>
  </ApolloProvider>
);

const UnAuthenticatedPages = ({
  onMountedLogin,
}: {
  onMountedLogin: ReturnType<typeof useAuth0>['loginWithRedirect'];
}) => {
  useEffect(() => {
    onMountedLogin({ returnTo: window.location.origin });
  }, [onMountedLogin]);

  return <></>;
};

const Pages = () => {
  const { authenticated, loginWithRedirect, loading } = useAuth0();

  return loading ? (
    <LoadingScreen />
  ) : authenticated ? (
    <AuthenticatedPages />
  ) : (
    <UnAuthenticatedPages onMountedLogin={loginWithRedirect} />
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
