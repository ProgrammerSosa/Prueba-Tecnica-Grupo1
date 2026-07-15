import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { AuthShell } from "../components/AuthShell";
import { AuthAlert } from "../components/AuthAlert";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { ForgotPassword } from "../components/ForgotPassword";

const viewCopy = {
  login: "Entra a la colmena",
  register: "Únete al enjambre",
  forgot: "Recupera tu acceso al panal",
};

export const AuthPage = () => {
  const authError = useAuthStore((state) => state.error);
  const [currentView, setCurrentView] = useState("login");
  const prefersReducedMotion = useReducedMotion();

  const handleSwitchView = (view) => {
    useAuthStore.getState().clearError();
    setCurrentView(view);
  };

  return (
    <AuthShell subtitle="Inventario que trabaja como colmena">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-honeycomb">
            Acceso BeeHive
          </p>
          <h2 className="mb-5 font-display text-2xl font-bold text-cacao-ink md:text-3xl">
            {viewCopy[currentView]}
          </h2>

          {authError && currentView !== "forgot" && currentView !== "register" && (
            <AuthAlert>{authError}</AuthAlert>
          )}

          {currentView === "login" ? (
            <LoginForm onSwitchView={handleSwitchView} />
          ) : currentView === "register" ? (
            <RegisterForm onSwitchView={handleSwitchView} />
          ) : (
            <ForgotPassword onSwitchView={handleSwitchView} />
          )}
        </motion.div>
      </AnimatePresence>
    </AuthShell>
  );
};
