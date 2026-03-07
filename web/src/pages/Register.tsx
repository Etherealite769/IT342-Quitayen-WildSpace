import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { Building2, Mail, Lock, User, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!email.includes('@university.edu')) {
      toast.error('Please use your university email address');
      return;
    }

    setIsLoading(true);
    const success = await register(studentId, fullName, email, password);
    setIsLoading(false);

    if (success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error('Student ID or email already exists');
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .card-anim { animation: cardIn .6s cubic-bezier(.22,1,.36,1) both; }

        /* Page bg */
        .ws-page {
          flex: 1;
          background: linear-gradient(140deg, #f0ede8 0%, #e8e4f0 50%, #e4edf5 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 48px 16px;
        }

        /* Card */
        .ws-card {
          background: #fff;
          border-radius: 40px;
          box-shadow: 
            0 10px 25px rgba(0,0,0,0.02),
            0 20px 48px rgba(0,0,0,0.05),
            0 1px 4px rgba(0,0,0,0.01);
          width: 100%; max-width: 480px;
          overflow: hidden;
        }

        .ws-card-header {
          padding: 80px 44px 32px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }

        .ws-logo-ring {
          width: 60px; height: 60px;
          background: #2563eb;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white;
          box-shadow: 0 8px 20px rgba(37,99,235,0.3);
          margin-bottom: 32px;
          transition: transform .22s cubic-bezier(.4,0,.2,1);
          cursor: default;
        }
        .ws-logo-ring:hover { transform: scale(1.08) rotate(-5deg); }

        .ws-title {
          font-family: 'DM Serif Display', serif;
          font-size: 48px;
          font-weight: 400;
          letter-spacing: -0.03em;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 16px;
          text-align: center;
        }
        .ws-subtitle {
          font-size: 14px;
          color: #64748b;
          font-weight: 400;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .ws-card-body { padding: 4px 44px 64px; }

        /* Form */
        .ws-form { display: flex; flex-direction: column; gap: 24px; }

        .ws-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }

        .ws-field-wrap { position: relative; }

        .ws-field-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; pointer-events: none; display: flex;
        }

        .ws-input {
          width: 100%;
          height: 56px;
          padding: 0 46px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1e293b;
          background: #ede9e3;
          border: 1.5px solid transparent;
          border-radius: 12px;
          outline: none;
          transition: background .18s, border-color .18s, box-shadow .18s;
        }
        .ws-input::placeholder { color: #b0aaa0; }
        .ws-input:hover { background: #e5e0d8; }
        .ws-input:focus {
          background: #fff;
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.12);
        }

        /* Submit */
        .ws-submit {
          width: 100%; height: 56px;
          background: #1a1714;
          color: #fff;
          border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px; font-weight: 700;
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: background .15s, box-shadow .15s, transform .12s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          margin-top: 8px;
          letter-spacing: 0.01em;
        }
        .ws-submit::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.08) 50%, transparent 65%);
          transform: translateX(-100%);
          transition: transform .5s ease;
        }
        .ws-submit:hover::after { transform: translateX(100%); }
        .ws-submit:hover {
          background: #000;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          transform: translateY(-1px);
        }
        .ws-submit:active { transform: translateY(0); }
        .ws-submit:disabled { opacity: .45; cursor: not-allowed; transform: none; }

        /* Sign up */
        .ws-signup {
          text-align: center; font-size: 14px; color: #666;
          font-weight: 500; margin-top: 40px;
        }
        .ws-signup a {
          color: #2563eb; font-weight: 700; text-decoration: none;
          transition: color .15s;
        }
        .ws-signup a:hover { color: #1d4ed8; }
      `}</style>

      {/* ── Page ── */}
      <div className="ws-page">
        <div className="ws-card card-anim">

          {/* Header */}
          <div className="ws-card-header">
            <div className="ws-logo-ring">
              <Building2 size={30} />
            </div>
            <h1 className="ws-title">Create account</h1>
            <p className="ws-subtitle">Register with your university credentials</p>
          </div>

          {/* Body */}
          <div className="ws-card-body">
            <form className="ws-form" onSubmit={handleSubmit}>

              {/* Student ID */}
              <div>
                <label className="ws-label" htmlFor="studentId">Student ID</label>
                <div className="ws-field-wrap">
                  <span className="ws-field-icon"><CreditCard size={17} strokeWidth={1.8} /></span>
                  <input
                    id="studentId" type="text"
                    placeholder="STU12345"
                    value={studentId} onChange={e => setStudentId(e.target.value)}
                    className="ws-input" required
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="ws-label" htmlFor="fullName">Full Name</label>
                <div className="ws-field-wrap">
                  <span className="ws-field-icon"><User size={17} strokeWidth={1.8} /></span>
                  <input
                    id="fullName" type="text"
                    placeholder="John Doe"
                    value={fullName} onChange={e => setFullName(e.target.value)}
                    className="ws-input" required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="ws-label" htmlFor="email">University Email</label>
                <div className="ws-field-wrap">
                  <span className="ws-field-icon"><Mail size={17} strokeWidth={1.8} /></span>
                  <input
                    id="email" type="email"
                    placeholder="student@university.edu"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="ws-input" required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="ws-label" htmlFor="password">Password</label>
                <div className="ws-field-wrap">
                  <span className="ws-field-icon"><Lock size={17} strokeWidth={1.8} /></span>
                  <input
                    id="password" type="password"
                    placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="ws-input" required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="ws-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="ws-field-wrap">
                  <span className="ws-field-icon"><Lock size={17} strokeWidth={1.8} /></span>
                  <input
                    id="confirmPassword" type="password"
                    placeholder="••••••••"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className="ws-input" required
                  />
                </div>
              </div>

              <button type="submit" className="ws-submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="ws-signup">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
