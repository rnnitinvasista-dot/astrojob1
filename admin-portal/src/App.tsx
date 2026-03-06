import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import AdminPortal from './components/admin/AdminPortal';
import { ShieldAlert } from 'lucide-react';

function App() {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Authenticating...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  // EMERGENCY BYPASS: Always allow master admin
  const isMasterAdmin = currentUser?.email?.toLowerCase() === 'astroadmin09@gmail.com';

  if (!isMasterAdmin && userData?.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <ShieldAlert size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '1rem' }}>Access Denied</h1>
          <p style={{ color: '#64748b', lineHeight: 1.6 }}>
            This portal is restricted to administrators only. Your account does not have the required permissions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button
              onClick={async () => {
                const { auth } = await import('./firebase');
                await auth.signOut();
                window.location.reload();
              }}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                background: 'white',
                color: '#64748b',
                border: '1.5px solid #e2e8f0',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
            <button
              onClick={() => window.location.href = 'https://astrojob-f0918.web.app'}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                background: '#1d4ed8',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Return to Astro App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminPortal />;
}

export default App;
