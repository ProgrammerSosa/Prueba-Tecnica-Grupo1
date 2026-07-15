import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useForm } from 'react-hook-form';
import { showSuccess } from '../../../shared/utils/toast';

export const RegisterForm = ({ onSwitchView }) => {
  const error = useAuthStore(state => state.error);
  const [step, setStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const registerUser = useAuthStore(state => state.register);
  const loading = useAuthStore(state => state.loading);
  const { register, handleSubmit, trigger, formState: { errors } } = useForm({
    shouldUnregister: false
  });

  const handleStep1Submit = async () => {
    const fieldsToValidate = ['name', 'surname', 'username', 'phone', 'email', 'password'];
    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      for (const field of fieldsToValidate) {
        if (errors[field]) {
          useAuthStore.getState().setError(errors[field].message);
          return;
        }
      }
      useAuthStore.getState().setError('Verifica el formato de los campos.');
      return;
    }
    useAuthStore.getState().clearError();
    setStep(2);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('surname', data.surname);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('phone', data.phone || '');
    formData.append('password', data.password);

    if (profilePic) {
      formData.append('profilePicture', profilePic);
    }

    const res = await registerUser(formData);
    if (res.success) {
      showSuccess('Usuario registrado exitosamente. Revisa tu email para verificar la cuenta.');
      setStep(3);
    } else {
      useAuthStore.getState().setError(res.error || 'Error al registrar el usuario');
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
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {step === 1 ? 'Paso 1: Información básica' : step === 2 ? 'Paso 2: Datos adicionales' : 'Registro completado'}
      </h2>
      {step < 3 && <p style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: '1rem' }}>Crea tu cuenta en nuestro sistema.</p>}

      {error && (
        <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {step === 1 && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Nombres</label>
              <input type="text" {...register("name", { required: "El campo 'Nombres' es obligatorio.", maxLength: { value: 25, message: "Máximo 25 caracteres" } })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }} placeholder="Nombres" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Apellidos</label>
              <input type="text" {...register("surname", { required: "El campo 'Apellidos' es obligatorio.", maxLength: { value: 25, message: "Máximo 25 caracteres" } })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }} placeholder="Apellidos" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Usuario</label>
              <input type="text" {...register("username", { required: "El campo 'Usuario' es obligatorio." })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }} placeholder="@usuario" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Teléfono</label>
              <input type="tel" {...register("phone", { maxLength: { value: 8, message: "Máximo 8 dígitos" } })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }} placeholder="12345678" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Correo Electrónico</label>
              <input type="email" {...register("email", { required: "El campo 'Correo' es obligatorio.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Formato inválido" } })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }} placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Contraseña</label>
              <input type="password" {...register("password", { required: "El campo 'Contraseña' es obligatorio.", minLength: { value: 8, message: "Mínimo 8 caracteres" } })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }} placeholder="••••••••" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Foto de perfil (Opcional)</label>
              <input type="file" accept="image/*" onChange={handleImageChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }} />
            </div>
            <button type="button" onClick={handleStep1Submit}
              style={{ width: '100%', padding: '0.75rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Siguiente
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ color: '#aaa', fontSize: '0.875rem' }}>Datos adicionales (opcional). Puedes completarlos después.</p>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Dirección</label>
              <input type="text" {...register("address")}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }} placeholder="Tu dirección" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => setStep(1)}
                style={{ padding: '0.75rem 1.5rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Atrás
              </button>
              <button type="submit" disabled={loading}
                style={{ flex: 1, padding: '0.75rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Procesando...' : 'Completar Registro'}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ marginBottom: '1rem' }}>¡Registro exitoso! Revisa tu correo para verificar tu cuenta.</p>
            <button type="button" onClick={() => onSwitchView('login')}
              style={{ padding: '0.75rem 2rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Ir a Iniciar Sesión
            </button>
          </div>
        )}
      </form>

      {step < 3 && (
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#aaa' }}>
          ¿Ya tienes cuenta?{' '}
          <button type="button" onClick={() => onSwitchView('login')} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontWeight: 'bold' }}>
            Iniciar sesión
          </button>
        </p>
      )}
    </>
  );
};
