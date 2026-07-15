import { useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { BeeIcon } from "../components/icons/BeeIcon";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <AuthShell subtitle="Este panal está reservado">
      <div className="text-center">
        <BeeIcon className="mx-auto mb-3 h-12 w-12 text-danger" animate={false} />
        <p className="font-display text-5xl font-extrabold text-danger">403</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-cacao-ink">
          Acceso denegado
        </h2>
        <p className="mb-6 mt-2 text-sm text-honeycomb">
          No tienes permiso para entrar a este sector del panal.
        </p>
        <button onClick={() => navigate("/")} className="auth-btn-primary">
          Volver al inicio
        </button>
      </div>
    </AuthShell>
  );
};
