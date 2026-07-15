import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1a1a2e', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#16213e', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#e63946', marginBottom: '0.5rem' }}>403</h1>
        <h2 style={{ marginBottom: '1rem' }}>Acceso Denegado</h2>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>No tienes permisos para acceder a este recurso.</p>
        <button onClick={() => navigate('/')}
          style={{ padding: '0.75rem 2rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};
