import React, { ReactNode } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

type Props = {
  children: ReactNode;
};

const theme = createMuiTheme({
  palette: {
    primary: { main: '#262626' },
  },
});

export const ThemeProvider = ({ children }: Props) => <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
