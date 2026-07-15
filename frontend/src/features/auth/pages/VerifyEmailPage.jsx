import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { AuthShell } from "../components/AuthShell";
import { BeeIcon } from "../components/icons/BeeIcon";

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { status, message } = useVerifyEmail(token);
  const prefersReducedMotion = useReducedMotion();

  return (
    <AuthShell subtitle="Confirma tu lugar en la colmena">
      <div className="text-center">
        <motion.div
          initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 flex justify-center"
        >
          <BeeIcon
            className="h-14 w-14 text-honey-nectar"
            animate={status === "verifying"}
          />
        </motion.div>

        {status === "verifying" && (
          <>
            <h2 className="mb-2 font-display text-2xl font-bold text-cacao-ink">
              Verificando...
            </h2>
            <p className="text-sm text-honeycomb">
              Estamos confirmando tu acceso al panal.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="mb-2 font-display text-2xl font-bold text-cacao-ink">
              Correo verificado
            </h2>
            <p className="mb-6 text-sm text-honeycomb">
              Ya perteneces a la colmena. Puedes entrar cuando quieras.
            </p>
            <button onClick={() => navigate("/")} className="auth-btn-primary">
              Entrar a la colmena
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="mb-2 font-display text-2xl font-bold text-danger">
              No se pudo verificar
            </h2>
            <p className="mb-6 text-sm text-honeycomb">
              {message || "El enlace expiró o no es válido. Reintenta el vuelo."}
            </p>
            <button onClick={() => navigate("/")} className="auth-btn-secondary">
              Volver al inicio
            </button>
          </>
        )}
      </div>
    </AuthShell>
  );
};
