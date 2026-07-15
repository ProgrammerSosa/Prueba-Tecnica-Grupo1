import { useAuthStore } from '../store/useAuthStore';
import { useForm } from 'react-hook-form';
import { showSuccess } from '../../../shared/utils/toast';

export const ForgotPassword = ({ onSwitchView }) => {
  const error = useAuthStore(state => state.error);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { requestPasswordReset, loading } = useAuthStore();

  const onSubmit = async (data) => {
    const response = await requestPasswordReset(data.email);
    if (response.success) {
      showSuccess('Correo de recuperación enviado exitosamente');
      onSwitchView('login');
    } else {
      useAuthStore.getState().setError(response.error || 'Error al enviar correo de recuperación');
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    useAuthStore.getState().setError(firstError?.message || 'Por favor, revisa tu correo electrónico.');
  };

  return (
    <>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Recuperar Contraseña</h2>
      <p style={{ color: '#aaa', fontSize: '0.875rem', marginBottom: '1rem' }}>Ingresa tu correo para recibir instrucciones.</p>

      <form onSubmit={handleSubmit(onSubmit, onError)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#aaa' }}>Correo Electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333', background: '#1a1a2e', color: '#fff', fontSize: '0.875rem' }}
            {...register('email', {
              required: "El campo 'Correo Electrónico' es obligatorio.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Formato inválido" }
            })}
          />
          {errors.email && <p style={{ color: '#ff6b6b', fontSize: '0.75rem' }}>{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '0.75rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Enviando...' : 'Enviar Instrucciones'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#aaa' }}>
        <button type="button" onClick={() => onSwitchView('login')} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontWeight: 'bold' }}>
          Volver a Iniciar Sesión
        </button>
      </p>
    </>
  );
};
