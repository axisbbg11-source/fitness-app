import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from './components';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    localStorage.setItem("fitcoach_logged_in", "true");
    e.preventDefault();
    setErr('');
    if (!email || !pass) { setErr('Please fill in all fields'); return; }
    setLoading(true);
    // Simulated login — replace with your actual auth
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }));
      localStorage.setItem('token', 'demo-token');
      setLoading(false);
      onLogin();
      nav('/dashboard');
    }, 1000);
  };

  const handleGoogle = () => {
    localStorage.setItem("fitcoach_logged_in", "true");
    // Replace with your Google auth logic
    localStorage.setItem('user', JSON.stringify({ name: 'User', email: 'user@gmail.com' }));
    localStorage.setItem('token', 'google-token');
    nav('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center relative">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-md mx-4 bg-gray-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            FitCoach
          </h1>
          <p className="text-gray-400 mt-2">AI-Powered Fitness Coach</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              placeholder="Enter password" />
          </div>

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button onClick={handleGoogle}
          className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account? <span className="text-yellow-400 cursor-pointer hover:underline">Sign up</span>
        </p>
      </div>
    </div>
  );
}