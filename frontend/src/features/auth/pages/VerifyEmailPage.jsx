import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useVerifyEmail } from '../hooks/useVerifyEmail';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { status, message } = useVerifyEmail(token);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1a1a2e', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#16213e', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', color: '#fff', textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <h2 style={{ marginBottom: '1rem' }}>Verificando...</h2>
            <p style={{ color: '#aaa' }}>Estamos verificando tu identidad.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h2 style={{ color: '#4CAF50', marginBottom: '1rem' }}>¡Email Verificado!</h2>
            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Tu correo ha sido verificado exitosamente.</p>
            <button onClick={() => navigate('/')}
              style={{ padding: '0.75rem 2rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Iniciar Sesión
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>Error de Verificación</h2>
            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>{message || 'El enlace ha expirado o es inválido.'}</p>
            <button onClick={() => navigate('/')}
              style={{ padding: '0.75rem 2rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Volver al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
};
