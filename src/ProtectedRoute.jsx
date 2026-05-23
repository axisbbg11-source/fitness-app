import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{
          background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
        }}
      >
        <div className="relative w-14 h-14">
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: 'rgba(79,209,255,0.15)', animationDuration: '1.5s' }}
          />
          <div
            className="absolute inset-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'rgba(79,209,255,0.25)' }}
          />
          <div
            className="absolute inset-3 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#0a0a1a' }}
          >
            <span className="text-lg">💪</span>
          </div>
        </div>
        <p
          className="text-sm font-semibold tracking-wide"
          style={{
            background: 'linear-gradient(90deg, #4FD1FF, #ff9a76)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          FitCoach AI
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}