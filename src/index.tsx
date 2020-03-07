import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { App } from './App';
import { ThemeProvider } from './providers/Theme';

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

ReactDOM.render(
  <>
    <GlobalStyle />
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </>,
  document.getElementById('root'),
);
