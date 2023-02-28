import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { enUS } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  enUS,
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
