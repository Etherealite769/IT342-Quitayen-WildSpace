import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Dots = ({ color = "white", size = 3, gap = 2 }) => (
  <div style={{ display: "flex", gap, alignItems: "center" }}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          opacity: color === "white" ? 0.9 : 0.5,
        }}
      />
    ))}
  </div>
);

export default function Login() {
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('student123');
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) navigate('/');
  }, [auth.user, navigate]);

  if (auth.user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await auth.login(email, password);
    setIsLoading(false);
    if (success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        @keyframes loginCardIn {
          from { opacity: 0; transform: translateY(28px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .login-card-anim { animation: loginCardIn .6s cubic-bezier(.22,1,.36,1) both; }

        .login-page {
          background: linear-gradient(140deg, #f0ede8 0%, #e8e4f0 50%, #e4edf5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 16px;
          min-height: 100vh;
        }

        .login-card {
          background: #fff;
          border-radius: 40px;
          box-shadow:
            0 10px 25px rgba(0,0,0,0.02),
            0 20px 48px rgba(0,0,0,0.05),
            0 1px 4px rgba(0,0,0,0.01);
          width: 100%;
          max-width: 480px;
          overflow: hidden;
        }

        .login-card-header {
          padding: 80px 44px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .login-logo-ring {
          width: 60px;
          height: 60px;
          background: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 20px rgba(37,99,235,0.3);
          margin-bottom: 32px;
          transition: transform .22s cubic-bezier(.4,0,.2,1);
          cursor: default;
        }
        .login-logo-ring:hover { transform: scale(1.08) rotate(-5deg); }

        .login-title {
          font-family: 'DM Serif Display', serif;
          font-size: 48px;
          font-weight: 400;
          letter-spacing: -0.03em;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 16px;
          text-align: center;
        }

        .login-subtitle {
          font-size: 14px;
          color: #64748b;
          font-weight: 400;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .login-card-body { padding: 4px 44px 64px; }

        .login-form { display: flex; flex-direction: column; gap: 24px; }

        .login-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }

        .login-field-wrap { position: relative; }

        .login-field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          display: flex;
        }

        .login-input {
          width: 100%;
          height: 56px;
          padding: 0 118px 0 46px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1e293b;
          background: #ede9e3;
          border: 1.5px solid transparent;
          border-radius: 12px;
          outline: none;
          transition: background .18s, border-color .18s, box-shadow .18s;
        }
        .login-input::placeholder { color: #b0aaa0; }
        .login-input:hover { background: #e5e0d8; }
        .login-input:focus {
          background: #fff;
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        .login-field-actions {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .login-pill-red {
          height: 28px;
          width: 40px;
          background: #e54b4b;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .15s, transform .1s;
          box-shadow: 0 1px 3px rgba(229,75,75,0.2);
        }
        .login-pill-red:hover { background: #d43f3f; transform: scale(1.04); }

        .login-pill-dark {
          height: 28px;
          width: 54px;
          background: #1a1714;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .15s, transform .1s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .login-pill-dark:hover { background: #000; transform: scale(1.04); }

        .login-submit {
          width: 100%;
          height: 56px;
          background: #1a1714;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background .15s, box-shadow .15s, transform .12s;
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
          margin-top: 8px;
          letter-spacing: 0.01em;
        }
        .login-submit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.08) 50%, transparent 65%);
          transform: translateX(-100%);
          transition: transform .5s ease;
        }
        .login-submit:hover::after { transform: translateX(100%); }
        .login-submit:hover {
          background: #020617;
          box-shadow: 0 8px 24px rgba(0,0,0,0.28);
          transform: translateY(-1px);
        }
        .login-submit:active { transform: translateY(0); }
        .login-submit:disabled { opacity: .45; cursor: not-allowed; transform: none; }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 48px 0 24px;
        }
        .login-divider-line { flex: 1; height: 1px; background: #eee; }
        .login-divider-text {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #bbb;
          white-space: nowrap;
        }

        .login-demo-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f5f5f5;
        }
        .login-demo-row:last-child { border-bottom: none; }
        .login-demo-label { font-size: 13px; font-weight: 600; color: #666; width: 80px; }
        .login-demo-creds { font-size: 12px; color: #999; font-weight: 400; flex: 1; text-align: right; }

        .login-signup {
          text-align: center;
          font-size: 14px;
          color: #666;
          font-weight: 500;
          margin-top: 40px;
        }
        .login-signup a {
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
          transition: color .15s;
        }
        .login-signup a:hover { color: #1d4ed8; }
      `}</style>

      <div className="login-page">
        <div className="login-card login-card-anim">

          <div className="login-card-header">
            <div className="login-logo-ring">
              <Building2 size={30} />
            </div>
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Enter your credentials to access your account</p>
          </div>

          <div className="login-card-body">
            <form className="login-form" onSubmit={handleSubmit}>

              <div>
                <label className="login-label" htmlFor="login-email">Email</label>
                <div className="login-field-wrap">
                  <span className="login-field-icon"><Mail size={17} strokeWidth={1.8} /></span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="login-input"
                    required
                  />
                  <div className="login-field-actions">
                    <button type="button" className="login-pill-red" onClick={() => setEmail("")} title="Clear">
                      <Dots color="white" size={3} gap={2} />
                    </button>
                    <button type="button" className="login-pill-dark" title="More">
                      <Dots color="white" size={3.5} gap={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="login-label" htmlFor="login-password">Password</label>
                <div className="login-field-wrap">
                  <span className="login-field-icon"><Lock size={17} strokeWidth={1.8} /></span>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="login-input"
                    required
                  />
                  <div className="login-field-actions">
                    <button type="button" className="login-pill-red" onClick={() => setPassword("")} title="Clear">
                      <Dots color="white" size={3} gap={2} />
                    </button>
                    <button type="button" className="login-pill-dark" title="More">
                      <Dots color="white" size={3.5} gap={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="login-submit" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">Demo Accounts</span>
              <div className="login-divider-line" />
            </div>

            <div>
              {[
                { role: "Student:", creds: "student@university.edu / student123" },
                { role: "Admin:",   creds: "admin@university.edu / admin123" },
              ].map(({ role, creds }) => (
                <div key={role} className="login-demo-row">
                  <span className="login-demo-label">{role}</span>
                  <span className="login-demo-creds">{creds}</span>
                </div>
              ))}
            </div>

            <p className="login-signup">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}