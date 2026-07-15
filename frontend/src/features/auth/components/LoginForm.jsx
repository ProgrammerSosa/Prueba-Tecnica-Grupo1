import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../../../shared/utils/toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export const LoginForm = ({ onSwitchView }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore(state => state.error);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.success) {
      navigate('/dashboard');
      showSuccess('¡Inicio de sesión exitoso!');
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore.getState().setError(firstError?.message || 'Por favor, revisa los campos requeridos.');
  };

  return (
    <>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Correo o Usuario</label>
          <input
            type="text"
            placeholder="usuario@correo.com"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff', fontSize: '0.875rem' }}
            {...register('emailOrUsername', { required: "El campo 'Correo o Usuario' es obligatorio." })}
          />
          {errors.emailOrUsername && <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>{errors.emailOrUsername.message}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff', fontSize: '0.875rem' }}
              {...register('password', { required: "El campo 'Contraseña' es obligatorio." })}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '0.75rem' }}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {errors.password && <span style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>{errors.password.message}</span>}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={() => onSwitchView('forgot')} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '0.875rem' }}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '0.75rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Procesando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#aaa' }}>
        ¿No tienes cuenta?{' '}
        <button type="button" onClick={() => onSwitchView('register')} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontWeight: 'bold' }}>
          Registrarse
        </button>
      </p>
    </>
  );
};
