import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { createGlobalStyle } from 'styled-components';
import { client } from './client';
import { App } from './App';

const GlobalStyle = createGlobalStyle`
  html, body {
    font-family:
      -apple-system, BlinkMacSystemFont, Segoe UI, Roboto Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica, Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    background: #fafafa;
    color: #262626;
  },
`;

const theme = createMuiTheme({
  palette: {
    primary: { main: '#262626' },
  },
});

ReactDOM.render(
  <>
    <GlobalStyle />
    <MuiThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </MuiThemeProvider>
  </>,
  document.getElementById('root'),
);
