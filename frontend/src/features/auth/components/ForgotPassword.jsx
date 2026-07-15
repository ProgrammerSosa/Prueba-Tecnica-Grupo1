import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { showSuccess } from "../../../shared/utils/toast";
import { AuthAlert } from "./AuthAlert";
import { AuthSubmitButton } from "./AuthSubmitButton";

export const ForgotPassword = ({ onSwitchView }) => {
  const error = useAuthStore((state) => state.error);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { requestPasswordReset, loading } = useAuthStore();

  const onSubmit = async (data) => {
    const response = await requestPasswordReset(data.email);
    if (response.success) {
      showSuccess("Instrucciones enviadas a tu panal de correo");
      onSwitchView("login");
    } else {
      useAuthStore
        .getState()
        .setError(response.error || "No se pudo enviar el correo de recuperación");
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore
      .getState()
      .setError(firstError?.message || "Revisa tu correo electrónico.");
  };

  return (
    <>
      <p className="mb-4 text-sm text-honeycomb">
        Indica tu correo y te enviaremos la ruta de regreso al panal.
      </p>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4">
        <AuthAlert>{error}</AuthAlert>

        <div>
          <label className="auth-label" htmlFor="forgot-email">
            Correo electrónico
          </label>
          <input
            id="forgot-email"
            type="email"
            placeholder="correo@ejemplo.com"
            className="auth-input"
            {...register("email", {
              required: "El campo 'Correo Electrónico' es obligatorio.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Formato inválido" },
            })}
          />
          {errors.email && (
            <p className="auth-field-error">{errors.email.message}</p>
          )}
        </div>

        <AuthSubmitButton loading={loading} loadingLabel="Enviando...">
          Recuperar acceso
        </AuthSubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-honeycomb">
        <button
          type="button"
          onClick={() => onSwitchView("login")}
          className="auth-link"
        >
          Volver a entrar
        </button>
      </p>
    </>
  );
};
