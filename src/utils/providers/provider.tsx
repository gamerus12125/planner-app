"use client"
import { createTheme, ThemeProvider } from "@mui/material";
import { ViewStoreProvider } from "./view-store-provider";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
      <ViewStoreProvider>
        <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
      </ViewStoreProvider>
  );
};
