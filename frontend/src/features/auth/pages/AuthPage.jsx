import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { ForgotPassword } from '../components/ForgotPassword';

export const AuthPage = () => {
  const authError = useAuthStore((state) => state.error);
  const [currentView, setCurrentView] = useState('login');

  const handleSwitchView = (view) => {
    useAuthStore.getState().clearError();
    setCurrentView(view);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1a1a2e', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#16213e', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', color: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Prueba Grupo #1</h1>
          <p style={{ color: '#aaa', fontSize: '0.875rem' }}>Sistema de autenticación</p>
        </div>

        {authError && (
          <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
            {authError}
          </div>
        )}

        {currentView === 'login' ? (
          <LoginForm onSwitchView={handleSwitchView} />
        ) : currentView === 'register' ? (
          <RegisterForm onSwitchView={handleSwitchView} />
        ) : (
          <ForgotPassword onSwitchView={handleSwitchView} />
        )}
      </div>
    </div>
  );
};
