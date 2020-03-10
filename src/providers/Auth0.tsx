import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { useHistory } from 'react-router-dom';

type User = {
  name: string;
  email: string;
  picture: string;
  sub: string;
};

type Auth0Context = {
  authenticated: boolean;
  user: User;
  loading: boolean;
  getIdTokenClaims(options?: getIdTokenClaimsOptions): Promise<IdToken>;
  loginWithRedirect(options: RedirectLoginOptions): Promise<void>;
  getTokenSilently(options?: GetTokenSilentlyOptions): Promise<string | undefined>;
  getTokenWithPopup(options?: GetTokenWithPopupOptions): Promise<string | undefined>;
  logout(options?: LogoutOptions): void;
};

type Props = { children: ReactNode } & Auth0ClientOptions;

const Auth0Context = createContext((null as unknown) as Auth0Context);

export function useAuth0() {
  return useContext(Auth0Context);
}

export const Auth0Provider = ({ children, ...initOptions }: Props) => {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState((null as unknown) as User);
  const [client, setClient] = useState((null as unknown) as Auth0Client);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setClient(auth0FromHook);
      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        history.push(appState?.targetUrl || window.location.pathname);
      }
      const responseIsAuthenticated = await auth0FromHook.isAuthenticated();
      setAuthenticated(responseIsAuthenticated);
      if (responseIsAuthenticated) {
        const responseGetUser = await auth0FromHook.getUser();
        setUser(responseGetUser);
      }
      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Auth0Context.Provider
      value={{
        authenticated,
        user,
        loading,
        getIdTokenClaims: (options?: getIdTokenClaimsOptions) => client.getIdTokenClaims(options),
        loginWithRedirect: (options: RedirectLoginOptions) => client.loginWithRedirect(options),
        getTokenSilently: (options?: GetTokenSilentlyOptions) => client.getTokenSilently(options),
        getTokenWithPopup: (options?: GetTokenWithPopupOptions) => client.getTokenWithPopup(options),
        logout: (options?: LogoutOptions) => client.logout(options),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
