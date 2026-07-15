import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { showSuccess } from "../../../shared/utils/toast";
import { AuthAlert } from "./AuthAlert";
import { BeeIcon } from "./icons/BeeIcon";

const stepTitles = {
  1: "Datos del enjambre",
  2: "Detalles del panal",
  3: "Ya eres parte de la colmena",
};

export const RegisterForm = ({ onSwitchView }) => {
  const error = useAuthStore((state) => state.error);
  const [step, setStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const { register, handleSubmit, trigger, formState: { errors } } = useForm({
    shouldUnregister: false,
  });

  const handleStep1Submit = async () => {
    const fieldsToValidate = [
      "name",
      "surname",
      "username",
      "phone",
      "email",
      "password",
    ];
    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      for (const field of fieldsToValidate) {
        if (errors[field]) {
          useAuthStore.getState().setError(errors[field].message);
          return;
        }
      }
      useAuthStore.getState().setError("Verifica el formato de los campos.");
      return;
    }
    useAuthStore.getState().clearError();
    setStep(2);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("phone", data.phone || "");
    formData.append("password", data.password);

    if (profilePic) {
      formData.append("profilePicture", profilePic);
    }

    const res = await registerUser(formData);
    if (res.success) {
      showSuccess("Cuenta creada. Revisa tu correo para verificarla.");
      setStep(3);
    } else {
      useAuthStore
        .getState()
        .setError(res.error || "Error al registrar el usuario");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setProfilePic(file);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-cacao-ink">
          {stepTitles[step]}
        </h3>
        {step < 3 && (
          <span className="rounded-full bg-honey-nectar/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cacao-ink">
            Paso {step} de 2
          </span>
        )}
      </div>

      <AuthAlert>{error}</AuthAlert>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            {step === 1 && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="auth-label text-honeycomb">Nombres</label>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Nombres"
                      {...register("name", {
                        required: "El campo 'Nombres' es obligatorio.",
                        maxLength: { value: 25, message: "Máximo 25 caracteres" },
                      })}
                    />
                  </div>
                  <div>
                    <label className="auth-label text-honeycomb">Apellidos</label>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Apellidos"
                      {...register("surname", {
                        required: "El campo 'Apellidos' es obligatorio.",
                        maxLength: { value: 25, message: "Máximo 25 caracteres" },
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="auth-label text-honeycomb">Usuario</label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="@usuario"
                    {...register("username", {
                      required: "El campo 'Usuario' es obligatorio.",
                    })}
                  />
                </div>

                <div>
                  <label className="auth-label text-honeycomb">Teléfono</label>
                  <input
                    type="tel"
                    className="auth-input"
                    placeholder="12345678"
                    {...register("phone", {
                      maxLength: { value: 8, message: "Máximo 8 dígitos" },
                    })}
                  />
                </div>

                <div>
                  <label className="auth-label text-honeycomb">Correo electrónico</label>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="correo@ejemplo.com"
                    {...register("email", {
                      required: "El campo 'Correo' es obligatorio.",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Formato inválido",
                      },
                    })}
                  />
                </div>

                <div>
                  <label className="auth-label text-honeycomb">Contraseña</label>
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "El campo 'Contraseña' es obligatorio.",
                      minLength: { value: 8, message: "Mínimo 8 caracteres" },
                    })}
                  />
                </div>

                <div>
                  <label className="auth-label text-honeycomb">
                    Foto de perfil (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="auth-input file:mr-3 file:rounded-md file:border-0 file:bg-honey-nectar file:px-3 file:py-1 file:text-xs file:font-bold file:text-cacao-ink"
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Vista previa del perfil"
                      className="mt-3 h-16 w-16 rounded-full border-2 border-honey-nectar object-cover"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleStep1Submit}
                  className="auth-btn-primary mt-1"
                >
                  Siguiente vuelo
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm text-honeycomb">
                  Datos adicionales opcionales. Puedes completarlos después.
                </p>
                <div>
                  <label className="auth-label text-honeycomb">Dirección</label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Tu dirección"
                    {...register("address")}
                  />
                </div>
                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="auth-btn-secondary"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-btn-primary flex-1"
                  >
                    {loading ? "Registrando..." : "Completar registro"}
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center py-4 text-center">
                <BeeIcon className="mb-3 h-12 w-12 text-honey-nectar" />
                <p className="mb-4 text-sm text-honeycomb">
                  Registro exitoso. Revisa tu correo para confirmar tu lugar en la
                  colmena.
                </p>
                <button
                  type="button"
                  onClick={() => onSwitchView("login")}
                  className="auth-btn-primary max-w-xs"
                >
                  Ir a entrar
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </AnimatePresence>

      {step < 3 && (
        <p className="mt-5 text-center text-sm text-honeycomb">
          ¿Ya formas parte del enjambre?{" "}
          <button
            type="button"
            onClick={() => onSwitchView("login")}
            className="auth-link"
          >
            Entra
          </button>
        </p>
      )}
    </>
  );
};
