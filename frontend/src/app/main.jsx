import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import { createSessionKeepAlive } from "../features/auth/utils/sessionKeepAlive";
import { showInfo, showSuccess } from "../shared/utils/toast";
import "../styles/index.css";

const AppBootstrap = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const keepAlive = createSessionKeepAlive({
      getState: () => useAuthStore.getState(),
      refreshSession: () => useAuthStore.getState().refreshSession(),
      onWarn: (kind) => {
        if (kind === "renewed") {
          showSuccess("Sesión renovada por actividad");
        } else if (kind === "expiring") {
          showInfo("Tu sesión está por expirar. Guarda tu trabajo.");
        } else if (kind === "failed") {
          showInfo("No se pudo renovar la sesión. Vuelve a entrar si te saca.");
        }
      },
    });

    keepAlive.start();
    return () => keepAlive.stop();
  }, [isAuthenticated]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
        }}
      />
      <AppRoutes />
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppBootstrap />
    </BrowserRouter>
  </StrictMode>
);
