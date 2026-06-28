import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import "@/styles/tokens.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "@/App.jsx";
import { BrowserRouter } from "react-router-dom";

import { SidebarProvider } from "@/app/providers/SidebarProvider.jsx";
import { ThemeProvider } from "@/app/providers/ThemeProvider.jsx";
import AuthProvider from "@/app/providers/AuthProvider.jsx";
import DashboardProvider from "@/app/providers/DashboardProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <DashboardProvider>
              <SidebarProvider>
                <App />
              </SidebarProvider>
            </DashboardProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
