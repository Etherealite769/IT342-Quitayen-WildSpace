import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div
      className="flex items-center justify-center px-4 py-12 flex-1 min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f0ede8 0%, #e8e4f0 50%, #e4edf5 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(22px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ws-card { animation: cardIn .55s cubic-bezier(.22,1,.36,1) both; }

        .ws-brand-icon { transition: transform .2s cubic-bezier(.4,0,.2,1); }
        .ws-brand-icon:hover { transform: scale(1.07) rotate(-4deg); }

        .ws-input { transition: background .15s, border-color .15s, box-shadow .15s; }
        .ws-input:hover { background: #e5e0d8 !important; }
        .ws-input:focus {
          background: #fff !important;
          border-color: #2354e6 !important;
          box-shadow: 0 0 0 3px rgba(35,84,230,.13), 0 1px 3px rgba(26,23,20,.06) !important;
          outline: none;
        }

        .ws-btn { transition: background .15s, box-shadow .15s, transform .15s; position: relative; overflow: hidden; }
        .ws-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.09) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform .42s ease;
        }
        .ws-btn:hover::after { transform: translateX(100%); }
        .ws-btn:hover { background: #2f2a25 !important; box-shadow: 0 6px 20px rgba(26,23,20,.28) !important; transform: translateY(-1px); }
        .ws-btn:active { transform: translateY(0); }
        .ws-btn:disabled { opacity: .52; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Card */}
      <div
        className="ws-card w-full max-w-md rounded-[18px] border border-[#ddd9d2]"
        style={{
          background: '#faf9f7',
          boxShadow: '0 2px 6px rgba(26,23,20,.06), 0 16px 48px rgba(26,23,20,.13)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center gap-3 px-10 pt-10 pb-7">
          <div
            className="ws-brand-icon flex items-center justify-center w-[58px] h-[58px] rounded-full bg-blue-600 text-white cursor-default"
            style={{ boxShadow: '0 4px 18px rgba(35,84,230,.30)' }}
          >
            <Building2 size={26} />
          </div>

          <h1
            className="text-[26px] font-normal tracking-tight text-[#1a1714] leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Welcome back
          </h1>

          <p className="text-sm font-light text-[#6b6560]">
            Enter your credentials to access your account
          </p>
        </div>

        {/* ── Body ── */}
        <div className="px-10 pb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">

            {/* Email field */}
            <div className="flex flex-col gap-[7px]">
              <label htmlFor="email" className="text-[13px] font-medium text-[#1a1714] tracking-[.01em]">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#b5b0a9] pointer-events-none flex">
                  <Mail size={15} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="ws-input w-full h-11 pl-10 pr-4 text-sm text-[#1a1714] rounded-[10px] border-[1.5px] border-transparent placeholder:text-[#b5b0a9] placeholder:font-light"
                  style={{
                    background: '#ede9e3',
                    boxShadow: '0 1px 3px rgba(26,23,20,.06)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-[7px]">
              <label htmlFor="password" className="text-[13px] font-medium text-[#1a1714] tracking-[.01em]">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#b5b0a9] pointer-events-none flex">
                  <Lock size={15} />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="ws-input w-full h-11 pl-10 pr-4 text-sm text-[#1a1714] rounded-[10px] border-[1.5px] border-transparent placeholder:text-[#b5b0a9]"
                  style={{
                    background: '#ede9e3',
                    boxShadow: '0 1px 3px rgba(26,23,20,.06)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="ws-btn mt-1 w-full h-11 rounded-[10px] text-[14.5px] font-medium tracking-[.02em] text-[#f5f2ee]"
              style={{
                background: '#1a1714',
                boxShadow: '0 4px 14px rgba(26,23,20,.22)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#ddd9d2]" />
            <span className="text-[10.5px] font-medium uppercase tracking-[.08em] text-[#9e9892] whitespace-nowrap">
              Demo Accounts
            </span>
            <div className="flex-1 h-px bg-[#ddd9d2]" />
          </div>

          {/* Demo credentials */}
          <div
            className="flex flex-col gap-2 rounded-[10px] border border-[#ddd9d2] p-3"
            style={{ background: '#f5f2ec' }}
          >
            {[
              { role: 'Student', creds: 'student@university.edu / student123' },
              { role: 'Admin',   creds: 'admin@university.edu / admin123' },
            ].map(({ role, creds }) => (
              <div key={role} className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#6b6560]">{role}</span>
                <span
                  className="text-[11.5px] text-[#1a1714] rounded-[5px] px-[7px] py-[2px]"
                  style={{ fontFamily: 'SFMono-Regular, Fira Code, monospace', background: 'rgba(26,23,20,.06)' }}
                >
                  {creds}
                </span>
              </div>
            ))}
          </div>

          {/* Sign-up */}
          <p className="mt-6 text-center text-[13px] text-[#6b6560]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150 underline-offset-[3px] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}