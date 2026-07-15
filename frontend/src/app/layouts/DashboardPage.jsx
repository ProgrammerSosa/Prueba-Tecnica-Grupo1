import { Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from "../../features/auth/store/useAuthStore.js"

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isRootDashboard = location.pathname === '/dashboard';

  const handleLogout = () => {
    useAuthStore.getState().logout();
    window.location.href = '/';
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ background: '#1a1a2e', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Prueba Grupo #1</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{user?.username} ({user?.role})</span>
          <button
            onClick={handleLogout}
            style={{ padding: '0.5rem 1rem', background: '#e63946', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
      <main style={{ padding: '1rem' }}>
        {isRootDashboard ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Dashboard</h1>
            <p>Bienvenido, {user?.username}</p>
            <p>Rol: {user?.role}</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
