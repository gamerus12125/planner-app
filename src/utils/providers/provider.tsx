'use client';
import { createTheme, ThemeProvider } from '@mui/material';
import { EventsStoreProvider } from './events-store-provider';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <EventsStoreProvider>
      <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
    </EventsStoreProvider>
  );
};
