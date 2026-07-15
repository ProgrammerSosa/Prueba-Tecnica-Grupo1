import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { showSuccess } from "../../../shared/utils/toast";
import { AuthShell } from "../components/AuthShell";
import { AuthAlert } from "../components/AuthAlert";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!token) {
      useAuthStore
        .getState()
        .setError("Falta el token de recuperación en la URL.");
      return;
    }

    const res = await resetPassword({ token, newPassword: data.newPassword });
    if (res.success) {
      useAuthStore.getState().clearError();
      showSuccess("Contraseña actualizada. Ya puedes entrar.");
      navigate("/");
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore
      .getState()
      .setError(firstError?.message || "Revisa todos los campos requeridos.");
  };

  return (
    <AuthShell subtitle="Recupera tu acceso al panal">
      <h2 className="mb-2 font-display text-2xl font-bold text-cacao-ink">
        Nueva contraseña
      </h2>
      <p className="mb-5 text-sm text-honeycomb">
        Elige una clave fuerte para volver a la colmena.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-4"
      >
        <AuthAlert>{error}</AuthAlert>

        <div>
          <label className="auth-label text-honeycomb" htmlFor="newPassword">
            Nueva contraseña
          </label>
          <input
            id="newPassword"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            {...register("newPassword", {
              required: "El campo 'Nueva Contraseña' es obligatorio.",
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
            })}
          />
          {errors.newPassword && (
            <span className="auth-field-error">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div>
          <label className="auth-label text-honeycomb" htmlFor="confirmPassword">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="auth-input"
            placeholder="••••••••"
            {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: (val) => {
                if (watch("newPassword") != val) {
                  return "Las contraseñas no coinciden.";
                }
              },
            })}
          />
          {errors.confirmPassword && (
            <span className="auth-field-error">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="auth-btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="auth-btn-primary flex-1"
          >
            {loading ? "Guardando..." : "Actualizar clave"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
};
