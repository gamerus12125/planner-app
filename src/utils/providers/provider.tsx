"use client";
import { createTheme, ThemeProvider } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
};
