import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Register from './pages/Register';
import { Building2 } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">WildSpace</h1>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © 2026 WildSpace. Campus Facility Management System.
      </div>
    </footer>
  );
}

function ProtectedHome() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex items-center justify-center h-full flex-col gap-4">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to WildSpace</h1>
      <div className="text-center text-gray-600">
        <p>Hello, {user.fullName}</p>
        <p className="text-sm">Student ID: {user.studentId}</p>
      </div>
      <button 
        onClick={logout}
        className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
      >
        Logout
      </button>
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
          <Header />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
