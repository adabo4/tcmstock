import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { NotificationProvider } from "./context/NotificationProvider.tsx";
import { StockLocationProvider } from "./context/StockLocationProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <StockLocationProvider>
        <NotificationProvider>
          <App></App>
        </NotificationProvider>
      </StockLocationProvider>
    </AuthProvider>
  </StrictMode>,
);
