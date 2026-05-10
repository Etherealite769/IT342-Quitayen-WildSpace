import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './shared/contexts/AuthContext';
import { Toaster } from 'sonner';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Dashboard from './features/dashboard/pages/Dashboard';
import BookRoom from './features/booking/pages/BookRoom';
import Rooms from './features/rooms/pages/Rooms';
import RoomDetails from './features/rooms/pages/RoomDetails';
import Reservations from './features/booking/pages/Reservations';
import AdminDashboard from './features/admin/pages/AdminDashboard';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/rooms" element={user ? <Rooms /> : <Navigate to="/login" replace />} />
      <Route path="/rooms/:roomId" element={user ? <RoomDetails /> : <Navigate to="/login" replace />} />
      <Route path="/reservations" element={user ? <Reservations /> : <Navigate to="/login" replace />} />
      <Route path="/book" element={user ? <BookRoom /> : <Navigate to="/login" replace />} />
      <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Auth pages render full screen without layout
  if (isAuthPage) {
    return <AppRoutes />;
  }

  // Authenticated pages have their own layout (Dashboard, BookRoom)
  return <AppRoutes />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
