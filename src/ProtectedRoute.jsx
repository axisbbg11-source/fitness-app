import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
          gap: '20px',
        }}
      >
        {/* ROTATING RINGS */}
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>

          {/* Outer spinning ring */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#4FD1FF',
            borderRightColor: '#ff9a76',
            animation: 'spin 1s linear infinite',
          }} />

          {/* Inner spinning ring (opposite direction) */}
          <div style={{
            position: 'absolute', inset: '10px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#ff9a76',
            borderLeftColor: '#4FD1FF',
            animation: 'spin 1.5s linear infinite reverse',
          }} />

        </div>

        {/* App name */}
        <p style={{
          background: 'linear-gradient(90deg, #4FD1FF, #ff9a76)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          fontSize: '1.1rem',
          letterSpacing: '0.5px',
          fontFamily: 'system-ui, sans-serif',
        }}>
          FitCoach
        </p>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}