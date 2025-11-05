'use client';
import { createTheme, ThemeProvider } from '@mui/material';
import { EventsStoreProvider } from './events-store-provider';
import { TasksStoreProvider } from './tasks-store-provider';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TasksStoreProvider>
      <EventsStoreProvider>
        <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
      </EventsStoreProvider>
    </TasksStoreProvider>
  );
};
