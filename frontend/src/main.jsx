import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import "./styles/tokens.css";

import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import { SidebarProvider } from "./providers/SidebarProvider.jsx";
import { ThemeProvider } from "./providers/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
