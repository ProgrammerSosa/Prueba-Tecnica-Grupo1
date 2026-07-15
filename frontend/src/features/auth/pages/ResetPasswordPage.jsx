import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';
import { showSuccess } from '../../../shared/utils/toast';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!token) {
      useAuthStore.getState().setError('Falta el token de recuperación en la URL.');
      return;
    }

    const res = await resetPassword({ token, newPassword: data.newPassword });
    if (res.success) {
      useAuthStore.getState().clearError();
      showSuccess('Tu contraseña ha sido actualizada.');
      navigate('/');
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore.getState().setError(firstError?.message || 'Por favor, revisa todos los campos requeridos.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1a1a2e', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#16213e', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', color: '#fff' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>Restablecer Contraseña</h2>
        <p style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>Ingresa tu nueva contraseña.</p>

        <form onSubmit={handleSubmit(onSubmit, onError)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Nueva Contraseña</label>
            <input type="password" {...register("newPassword", {
              required: "El campo 'Nueva Contraseña' es obligatorio.",
              minLength: { value: 8, message: "Mínimo 8 caracteres" }
            })}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }}
              placeholder="••••••••" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Confirmar Contraseña</label>
            <input type="password" {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: (val) => {
                if (watch('newPassword') != val) {
                  return "Las contraseñas no coinciden.";
                }
              }
            })}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff' }}
              placeholder="••••••••" />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => navigate('/')}
              style={{ padding: '0.75rem 1.5rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              style={{ flex: 1, padding: '0.75rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Procesando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
