import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ParticleBackground from './components';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";


export default function Login() {
  const nav = useNavigate();
  const { loginWithGoogle, user: firebaseUser } = useAuth();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [showSignUp, setShowSignUp] = useState(false);
  const [signName, setSignName] = useState('');
  const [signEmail, setSignEmail] = useState('');
  const [signPass, setSignPass] = useState('');
  const [signLoading, setSignLoading] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  // ─── Redirect if already logged in via Firebase ───
  useEffect(() => {
    if (firebaseUser) {
      nav('/dashboard', { replace: true });
    }
  }, [firebaseUser, nav]);

  const handleLogin = (e) => {
    e.preventDefault();
    setErr('');
    if (!email.trim()) { setErr('Please enter your email'); return; }
    if (!pass.trim()) { setErr('Please enter your password'); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('fitcoach_logged_in', 'true');
      localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }));
      localStorage.setItem('token', 'demo-token');
      setLoading(false);
      nav('/dashboard');
    }, 1200);
  };

  // ─── REAL Firebase Google Sign-In ───
  const handleGoogle = async () => {
    setErr('');
    try {
      await loginWithGoogle();
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setErr('Login cancelled.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setErr('Domain not authorized. Add it in Firebase Console → Authentication → Settings.');
      } else {
        setErr('Google login failed. Please try again.');
      }
      console.error('Google login error:', error);
    }
  };
const handleForgotPassword = async (e) => {
  e.preventDefault();

  setErr("");

  if (!resetEmail.trim()) {
    setErr("Please enter your email");
    return;
  }

  try {
    setResetLoading(true);

    await sendPasswordResetEmail(auth, resetEmail);

    setResetSent(true);
  } catch (error) {
    setErr(error.message);
  } finally {
    setResetLoading(false);
  }
};
  

  const handleSignUp = (e) => {
    e.preventDefault();
    setErr('');
    if (!signName.trim()) { setErr('Please enter your name'); return; }
    if (!signEmail.trim()) { setErr('Please enter your email'); return; }
    if (signPass.length < 6) { setErr('Password must be at least 6 characters'); return; }
    setSignLoading(true);
    handleGoogle();
  };

  const goBack = () => {
    setShowForgot(false);
    setShowSignUp(false);
    setResetSent(false);
    setResetEmail('');
    setSignName('');
    setSignEmail('');
    setSignPass('');
    setErr('');
  };

  // ═══════════════════════════════════════════
  // SHARED PIECES
  // ═══════════════════════════════════════════
  const anim = `transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;

  const glass = {
    background: 'rgba(8, 8, 12, 0.80)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.03)',
  };

  const inp = "w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-300 bg-white/[0.04] border border-white/[0.07] placeholder-gray-600 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/10/40 focus:bg-white/[0.06] focus:shadow-[0_0_16px_rgba(79,209,255,0.06)]";

  const Logo = () => (
    <div className="flex justify-center mb-5">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="7" width="5" height="10" rx="1.5" fill="#4FD1FF" />
            <rect x="18" y="7" width="5" height="10" rx="1.5" fill="#4FD1FF" />
            <rect x="5" y="11" width="14" height="2" rx="1" fill="rgba(255,255,255,0.65)" />
            <rect x="3" y="9" width="2" height="6" rx="0.5" fill="rgba(79,209,255,0.5)" />
            <rect x="19" y="9" width="2" height="6" rx="0.5" fill="rgba(79,209,255,0.5)" />
          </svg>
        </div>
      </div>
    </div>
  );

  const Spinner = () => (
    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );

  const EyeBtn = () => (
    <button type="button" onClick={() => setShowPass(!showPass)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">
      {showPass ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  const BackBtn = () => (
    <button onClick={goBack}
      className="flex items-center gap-1.5 text-gray-600 hover:text-white text-xs cursor-pointer transition-all duration-200 group mb-7 tracking-wide">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="group-hover:-translate-x-0.5 transition-transform duration-200">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );

  const MailIcon = () => (
    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  // ═══════════════════════════════════════════
  // FORGOT PASSWORD
  // ═══════════════════════════════════════════
  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative bg-black">
        <ParticleBackground />
        <div className={`relative z-10 w-full max-w-sm ${anim}`}>
          <div className="rounded-3xl overflow-hidden" style={glass}>
            <div className="p-8">
              <BackBtn />
              {!resetSent ? (
                <>
                  <div className="flex justify-center mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(79,209,255,0.07)', border: '1px solid rgba(79,209,255,0.1)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4FD1FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white text-center mb-1">Forgot Password?</h2>
                  <p className="text-gray-600 text-xs text-center mb-7">We'll send you a reset link.</p>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="relative"><MailIcon /><input type="email" placeholder="Email address" value={resetEmail}
                      onChange={(e) => { setResetEmail(e.target.value); setErr(''); }} className={inp} /></div>
                    {err && <p className="text-red-400/80 text-xs pl-1">{err}</p>}
                    <button type="submit" disabled={resetLoading}
                      className="w-full py-3.5 rounded-xl text-white font-bold text-sm cursor-pointer transition-all duration-300 hover:shadow-[0_8px_28px_rgba(79,209,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #4FD1FF, #e64a19)' }}>
                      {resetLoading ? <><Spinner /> Sending...</> : 'Send Reset Link'}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-5">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.07)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white text-center mb-1">Email Sent!</h2>
                  <p className="text-gray-600 text-xs text-center mb-7">Check <span className="text-white/70">{resetEmail}</span></p>
                  <button onClick={goBack}
                    className="w-full py-3 rounded-xl text-white/60 font-medium text-sm cursor-pointer hover:bg-white/[0.04] transition-all border border-white/[0.05]"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>Back to Sign In</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // SIGN UP
  // ═══════════════════════════════════════════
  if (showSignUp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative bg-black">
        <ParticleBackground />
        <div className={`relative z-10 w-full max-w-sm ${anim}`}>
          <div className="rounded-3xl overflow-hidden" style={glass}>
            <div className="p-8">
              <BackBtn />
              <Logo />
              <h2 className="text-xl font-bold text-white text-center mb-1">Create Account</h2>
              <p className="text-gray-600 text-xs text-center mb-7">Join FitCoach AI today</p>
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input type="text" placeholder="Full name" value={signName}
                    onChange={(e) => { setSignName(e.target.value); setErr(''); }} className={inp} />
                </div>
                <div className="relative"><MailIcon /><input type="email" placeholder="Email address" value={signEmail}
                  onChange={(e) => { setSignEmail(e.target.value); setErr(''); }} className={inp} /></div>
                <div className="relative"><LockIcon />
                  <input type={showPass ? 'text' : 'password'} placeholder="Password (min 6)" value={signPass}
                    onChange={(e) => { setSignPass(e.target.value); setErr(''); }} className={`${inp} pr-10`} />
                  <EyeBtn />
                </div>
                {err && <p className="text-red-400/80 text-xs pl-1">{err}</p>}
                <button type="submit" disabled={signLoading}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm cursor-pointer transition-all duration-300 hover:shadow-[0_8px_28px_rgba(79,209,255,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #4FD1FF, #e64a19)' }}>
                  {signLoading ? <><Spinner /> Creating...</> : 'Create Account'}
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/[0.05]" />
                <span className="text-gray-700 text-[10px] font-semibold tracking-widest uppercase">or</span>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>

              <button onClick={handleGoogle}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 hover:bg-white/[0.06] border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-white/60 text-xs font-medium">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-black">
      <ParticleBackground />

      <div className={`relative z-10 w-full max-w-sm ${anim}`}>
        <div className="rounded-3xl overflow-hidden" style={glass}>
          <div className="p-8">

            <Logo />

            <h2 className="text-2xl font-bold text-white text-center mb-1.5 tracking-tight">Welcome Back</h2>
            <p className="text-gray-600 text-xs text-center mb-7">
              Don't have an account yet?{' '}
              <button onClick={() => { setShowSignUp(true); setErr(''); }}
                className="text-sky-300 hover:underline underline-offset-2 cursor-pointer font-medium transition-colors">
                Sign up
              </button>
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative"><MailIcon />
                <input type="email" placeholder="Email address" value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(''); }} className={inp} />
              </div>

              <div className="relative"><LockIcon />
                <input type={showPass ? 'text' : 'password'} placeholder="Password" value={pass}
                  onChange={(e) => { setPass(e.target.value); setErr(''); }} className={`${inp} pr-10`} />
                <EyeBtn />
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => { setShowForgot(true); setErr(''); }}
                  className="text-sky-300/60 text-xs font-medium hover:text-sky-300 cursor-pointer transition-colors hover:underline underline-offset-2">
                  Forgot Password?
                </button>
              </div>

              {err && (
                <div className="flex items-center gap-2 text-red-400/80 text-xs bg-red-400/[0.05] rounded-lg px-3 py-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {err}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm cursor-pointer transition-all duration-300 hover:shadow-[0_8px_28px_rgba(79,209,255,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #4FD1FF, #e64a19)' }}>
                {loading ? <><Spinner /> Signing In...</> : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-gray-700 text-[10px] font-semibold tracking-widest uppercase">or</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            <button onClick={handleGoogle}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 hover:bg-white/[0.06] hover:scale-[1.01] active:scale-[0.99] border border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-white/60 text-xs font-medium">Continue with Google</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}