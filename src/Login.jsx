import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

.fc-login-root {
  min-height: 100vh;
  background: #fafaf5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: 'DM Sans', sans-serif;
}

.fc-login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  padding: 44px 40px;
  border-radius: 32px;
  border: 1px solid #dadad5;
  box-shadow: 0 12px 48px rgba(0,0,0,0.06);
}

.fc-brand {
  font-family: 'Syne', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #ff4d00;
  margin-bottom: 8px;
}

.fc-welcome {
  font-family: 'Syne', sans-serif;
  font-size: 2.1rem;
  font-weight: 800;
  color: #1c1c1a;
  margin-bottom: 10px;
}

.fc-subtitle {
  color: #474742;
  font-size: 0.9rem;
  margin-bottom: 30px;
}

.fc-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.fc-label {
  color: #474742;
  font-size: 0.82rem;
  font-weight: 600;
}

.fc-input {
  padding: 16px 18px;
  border: 2px solid transparent;
  outline: none;
  border-radius: 16px;
  background: #f4f4ef;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
}

.fc-input:focus {
  border-color: #ff4d00;
  background: #fff;
}

.fc-input.error {
  border-color: #e74c3c;
  background: #fff0f0;
}

.fc-error-msg {
  color: #e74c3c;
  font-size: 0.78rem;
}

.fc-login-btn {
  width: 100%;
  padding: 17px;
  border: none;
  border-radius: 18px;
  background: #ff4d00;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
}

.fc-login-btn:hover {
  background: #e04400;
}

.fc-divider {
  margin: 28px 0;
  text-align: center;
  color: #888880;
  font-size: 0.82rem;
}

.fc-google-btn {
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: 1.5px solid #dadad5;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 600;
}

.fc-google-btn:hover {
  border-color: #ff4d00;
}

.fc-footer {
  margin-top: 28px;
  text-align: center;
  color: #474742;
  font-size: 0.85rem;
}

.fc-footer a {
  color: #ff4d00;
  text-decoration: none;
  font-weight: 700;
}

.fc-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: 6px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = "Enter valid email";
    }
    if (!password.trim()) {
      e.password = "Password is required";
    } else if (password.length < 6) {
      e.password = "Minimum 6 characters";
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    localStorage.setItem("fitcoach_logged_in", "true");
    onLogin();
    navigate("/dashboard");
  };

  return (
    <>
      <style>{styles}</style>

      <div className="fc-login-root">
        <div className="fc-login-card">

          <div className="fc-brand">FitCoach AI</div>

          <h1 className="fc-welcome">Welcome back 👋</h1>

          <p className="fc-subtitle">Log in to continue your wellness journey.</p>

          <div className="fc-input-group">
            <label className="fc-label">Email</label>
            <input
              type="email"
              placeholder="hello@fitcoach.ai"
              className={`fc-input ${errors.email ? "error" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="fc-error-msg">{errors.email}</div>
            )}
          </div>

          <div className="fc-input-group">
            <label className="fc-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`fc-input ${errors.password ? "error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="fc-error-msg">{errors.password}</div>
            )}
          </div>

          <button
            className="fc-login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="fc-spinner"></span>
                Logging in...
              </>
            ) : (
              "Login →"
            )}
          </button>

          <div className="fc-divider">Or continue with</div>

          <button
            className="fc-google-btn"
            onClick={() => {
              localStorage.setItem("fitcoach_logged_in", "true");
              onLogin();
              navigate("/dashboard");
            }}
          >
            <img
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
              alt="Google"
              width={20}
            />
            Sign in with Google
          </button>

          <p className="fc-footer">
            New to FitCoach? <a href="#">Create Account</a>
          </p>

        </div>
      </div>
    </>
  );
}