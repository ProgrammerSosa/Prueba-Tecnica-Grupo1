import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { showSuccess } from "../../../shared/utils/toast";
import { AuthSubmitButton } from "./AuthSubmitButton";

export const LoginForm = ({ onSwitchView }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.success) {
      navigate("/dashboard");
      showSuccess("Bienvenido a la colmena");
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore.getState().setError(
      firstError?.message || "Sin néctar: revisa tus credenciales"
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4">
        <div>
          <label className="auth-label" htmlFor="emailOrUsername">
            Correo o usuario
          </label>
          <input
            id="emailOrUsername"
            type="text"
            placeholder="usuario@correo.com"
            className="auth-input"
            {...register("emailOrUsername", {
              required: "El campo 'Correo o Usuario' es obligatorio.",
            })}
          />
          {errors.emailOrUsername && (
            <span className="auth-field-error">{errors.emailOrUsername.message}</span>
          )}
        </div>

        <div>
          <label className="auth-label" htmlFor="password">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="auth-input pr-20"
              {...register("password", {
                required: "El campo 'Contraseña' es obligatorio.",
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wider text-cream-comb/80 transition hover:text-honey-nectar"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {errors.password && (
            <span className="auth-field-error">{errors.password.message}</span>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => onSwitchView("forgot")}
            className="auth-link text-sm"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <AuthSubmitButton loading={loading} loadingLabel="Despegando...">
          Entrar a la colmena
        </AuthSubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-honeycomb">
        ¿Aún no estás en el enjambre?{" "}
        <button
          type="button"
          onClick={() => onSwitchView("register")}
          className="auth-link"
        >
          Únete
        </button>
      </p>
    </>
  );
};
