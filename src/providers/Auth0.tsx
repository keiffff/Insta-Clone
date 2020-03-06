import React, { useEffect, useState, ReactNode, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { useHistory } from 'react-router-dom';

type User = {
  nickname: string;
  email: string;
  picture: string;
};

type Auth0Context = {
  authenticated: boolean;
  user: User | null;
  loading: boolean;
  getIdTokenClaims(options?: getIdTokenClaimsOptions): Promise<IdToken>;
  loginWithRedirect(options: RedirectLoginOptions): Promise<void>;
  getTokenSilently(options?: GetTokenSilentlyOptions): Promise<string | undefined>;
  logout(options?: LogoutOptions): void;
};

type Props = Auth0ClientOptions & { children: ReactNode };

export const Auth0Context = React.createContext((null as unknown) as Auth0Context);

export function useAuth0() {
  return useContext(Auth0Context);
}

export const Auth0Provider = ({ children, ...initOptions }: Props) => {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [auth0Client, setAuth0Client] = useState((null as unknown) as Auth0Client);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0Client(auth0FromHook);

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        history.push(appState?.targetUrl ?? window.location.pathname);
      }

      const resultIsAuthenticated = await auth0FromHook.isAuthenticated();

      setAuthenticated(resultIsAuthenticated);

      if (authenticated) {
        const resultGetUser: User = await auth0FromHook.getUser();
        setUser(resultGetUser);
      }

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Auth0Context.Provider
      value={{
        authenticated,
        user,
        loading,
        getIdTokenClaims: (options: getIdTokenClaimsOptions) => auth0Client.getIdTokenClaims(options),
        loginWithRedirect: (options: RedirectLoginOptions) => auth0Client.loginWithRedirect(options),
        getTokenSilently: (options?: GetTokenSilentlyOptions) => auth0Client.getTokenSilently(options),
        logout: (options?: LogoutOptions) => auth0Client.logout(options),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
