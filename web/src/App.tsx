
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Register from './pages/Register';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Building2 = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const LogOut = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ─── Shared styles injected once ─────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body, #root { font-family: 'DM Sans', sans-serif; }

    /* ── Navbar ── */
    .ws-header {
      position: sticky; top: 0; z-index: 50;
      height: 48px;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(12px) saturate(1.8);
      -webkit-backdrop-filter: blur(12px) saturate(1.8);
      border-bottom: 1px solid rgba(0,0,0,0.05);
      display: flex; align-items: center;
      padding: 0 24px;
    }
    .ws-header-inner {
      max-width: 1280px; width: 100%; margin: 0 auto;
      display: flex; align-items: center; justify-content: center;
    }
    .ws-brand {
      display: flex; align-items: center; gap: 8px;
      font-size: 17px; font-weight: 700; color: #0f172a;
      letter-spacing: -0.025em;
      cursor: default; user-select: none;
    }
    .ws-brand-icon {
      width: 28px; height: 28px;
      background: #2563eb;
      border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      color: white;
      box-shadow: 0 2px 6px rgba(37,99,235,0.25);
      flex-shrink: 0;
      transition: transform .2s cubic-bezier(.4,0,.2,1);
    }
    .ws-brand:hover .ws-brand-icon { transform: rotate(-6deg) scale(1.06); }

    /* ── Footer ── */
    .ws-footer {
      background: rgba(255,255,255,0.70);
      backdrop-filter: blur(12px);
      border-top: 1px solid rgba(0,0,0,0.06);
      padding: 18px 32px;
      text-align: center;
      font-size: 13px;
      color: #94a3b8;
      font-weight: 400;
      letter-spacing: 0.01em;
    }

    /* ── Page shells ── */
    .ws-app {
      min-height: 100vh;
      display: flex; flex-direction: column;
    }
    .ws-main { flex: 1; display: flex; flex-direction: column; }

    /* Auth pages get their own bg */
    .ws-auth-page {
      flex: 1;
      background: linear-gradient(140deg, #ede9e2 0%, #e6e1f0 45%, #dce8f4 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 48px 16px;
    }

    /* Home page */
    .ws-home-page {
      flex: 1;
      background: linear-gradient(140deg, #ede9e2 0%, #e6e1f0 45%, #dce8f4 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 48px 16px;
    }

    /* ── Card ── */
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(26px) scale(.965); }
      to   { opacity: 1; transform: none; }
    }
    .ws-card {
      background: #fff;
      border-radius: 28px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 14px 44px rgba(0,0,0,0.10), 0 40px 80px rgba(0,0,0,0.06);
      width: 100%; max-width: 440px;
      overflow: hidden;
      animation: cardIn .58s cubic-bezier(.22,1,.36,1) both;
    }
    .ws-card-header {
      padding: 52px 44px 28px;
      display: flex; flex-direction: column; align-items: center; text-align: center;
    }
    .ws-logo-ring {
      width: 68px; height: 68px;
      background: #2563eb;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white;
      box-shadow: 0 10px 24px rgba(37,99,235,0.32);
      margin-bottom: 26px;
      cursor: default;
      transition: transform .22s cubic-bezier(.4,0,.2,1);
    }
    .ws-logo-ring:hover { transform: scale(1.07) rotate(-5deg); }
    .ws-card-title {
      font-family: 'DM Serif Display', serif;
      font-size: 46px; font-weight: 400;
      letter-spacing: -0.03em; color: #0f172a;
      line-height: 1.06; margin-bottom: 12px;
    }
    .ws-card-subtitle { font-size: 15px; color: #64748b; font-weight: 400; line-height: 1.55; }
    .ws-card-body { padding: 4px 44px 52px; }

    /* ── Form ── */
    .ws-form { display: flex; flex-direction: column; gap: 20px; }
    .ws-label { display: block; font-size: 13.5px; font-weight: 600; color: #1e293b; margin-bottom: 8px; letter-spacing: 0.01em; }
    .ws-field { position: relative; }
    .ws-field-icon {
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
      color: #94a3b8; pointer-events: none; display: flex;
    }
    .ws-input {
      width: 100%; height: 54px;
      padding: 0 118px 0 46px;
      font-size: 14.5px; font-family: 'DM Sans', sans-serif;
      color: #1e293b;
      background: #f0ece5;
      border: 1.5px solid transparent;
      border-radius: 14px;
      outline: none;
      transition: background .17s, border-color .17s, box-shadow .17s;
    }
    .ws-input::placeholder { color: #b0aaa0; }
    .ws-input:hover { background: #e8e3db; }
    .ws-input:focus {
      background: #fff;
      border-color: #2563eb;
      box-shadow: 0 0 0 4px rgba(37,99,235,0.11);
    }
    .ws-field-btns {
      position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
      display: flex; align-items: center; gap: 5px;
    }
    .ws-pill {
      height: 26px; border: none; border-radius: 6px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: filter .15s, transform .1s;
    }
    .ws-pill:hover { filter: brightness(1.12); transform: scale(1.05); }
    .ws-pill-red { width: 38px; background: #e84040; box-shadow: 0 1px 4px rgba(232,64,64,0.22); }
    .ws-pill-dark { width: 50px; background: #1e293b; box-shadow: 0 1px 4px rgba(0,0,0,0.16); }

    .ws-submit {
      width: 100%; height: 54px;
      background: #0f172a; color: #fff;
      border: none; border-radius: 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 15.5px; font-weight: 700;
      cursor: pointer; position: relative; overflow: hidden;
      transition: background .15s, box-shadow .15s, transform .12s;
      box-shadow: 0 2px 10px rgba(0,0,0,0.20);
      margin-top: 6px; letter-spacing: 0.01em;
    }
    .ws-submit::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.08) 50%, transparent 65%);
      transform: translateX(-100%); transition: transform .48s ease;
    }
    .ws-submit:hover::after { transform: translateX(100%); }
    .ws-submit:hover { background: #020617; box-shadow: 0 8px 24px rgba(0,0,0,0.26); transform: translateY(-1px); }
    .ws-submit:active { transform: translateY(0); }
    .ws-submit:disabled { opacity: .42; cursor: not-allowed; transform: none; }

    /* Divider */
    .ws-divider { display: flex; align-items: center; gap: 14px; margin: 36px 0 18px; }
    .ws-divider-line { flex: 1; height: 1px; background: #f1f5f9; }
    .ws-divider-label {
      font-size: 10.5px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.12em; color: #94a3b8; white-space: nowrap;
    }

    /* Demo rows */
    .ws-demo-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 9px 0; border-bottom: 1px solid #f8fafc;
      font-size: 13px;
    }
    .ws-demo-row:last-child { border-bottom: none; }
    .ws-demo-role { font-weight: 600; color: #64748b; }
    .ws-demo-cred { color: #94a3b8; }

    .ws-signup {
      text-align: center; font-size: 14px; color: #64748b; font-weight: 500; margin-top: 30px;
    }
    .ws-signup a { color: #2563eb; font-weight: 700; text-decoration: none; transition: color .15s; }
    .ws-signup a:hover { color: #1d4ed8; }

    /* ── Home welcome card ── */
    .ws-welcome-card {
      background: #fff;
      border-radius: 28px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 14px 44px rgba(0,0,0,0.10);
      width: 100%; max-width: 520px;
      padding: 60px 52px;
      display: flex; flex-direction: column; align-items: center; text-align: center;
      animation: cardIn .58s cubic-bezier(.22,1,.36,1) both;
    }
    .ws-welcome-badge {
      display: inline-flex; align-items: center; gap: 7px;
      background: #eff6ff; color: #2563eb;
      font-size: 12px; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase;
      padding: 6px 14px; border-radius: 100px;
      margin-bottom: 28px;
    }
    .ws-welcome-title {
      font-family: 'DM Serif Display', serif;
      font-size: 40px; font-weight: 400;
      letter-spacing: -0.03em; color: #0f172a;
      line-height: 1.1; margin-bottom: 16px;
    }
    .ws-welcome-name { color: #2563eb; }
    .ws-welcome-meta {
      font-size: 14px; color: #94a3b8; font-weight: 400;
      margin-bottom: 36px; line-height: 1.7;
    }
    .ws-logout-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px;
      background: #0f172a; color: #fff;
      border: none; border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14.5px; font-weight: 600;
      cursor: pointer;
      transition: background .15s, box-shadow .15s, transform .12s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    }
    .ws-logout-btn:hover { background: #020617; box-shadow: 0 6px 18px rgba(0,0,0,0.22); transform: translateY(-1px); }
    .ws-logout-btn:active { transform: translateY(0); }
  `}</style>
);

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="ws-header">
      <div className="ws-header-inner">
        <div className="ws-brand">
          <div className="ws-brand-icon">
            <Building2 size={18} />
          </div>
          WildSpace
        </div>
      </div>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="ws-footer">
      © 2026 WildSpace. Campus Facility Management System.
    </footer>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function ProtectedHome() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="ws-home-page">
      <div className="ws-welcome-card">
        <div className="ws-welcome-badge">
          <Building2 size={12} />
          Campus Portal
        </div>
        <h1 className="ws-welcome-title">
          Hello, <span className="ws-welcome-name">{user.fullName}</span>
        </h1>
        <p className="ws-welcome-meta">
          Student ID: {user.studentId}<br />
          Welcome to the WildSpace Campus Facility Management System.
        </p>
        <button className="ws-logout-btn" onClick={logout}>
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedHome />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalStyles />
        <div className="ws-app">
          <Header />
          <main className="ws-main">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      <Toaster position="top-center" />
    </AuthProvider>
  );
}