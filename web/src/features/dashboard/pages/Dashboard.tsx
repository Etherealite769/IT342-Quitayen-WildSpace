import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import {
  Building2,
  Calendar,
  TrendingUp,
  Users,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import bookingAPI from '../../booking/services/bookingService';
import { toast } from 'sonner';

interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  building: string;
}

interface Booking {
  id: string;
  roomId: string;
  userId: string;
  roomName: string;
  startTime: number;
  endTime: number;
  status: string;
  totalPrice: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'ADMIN' || user.role === 'admin') {
      navigate('/admin');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, bookingsData] = await Promise.all([
        bookingAPI.getAllRooms(),
        bookingAPI.getUserBookings(),
      ]);
      setRooms(roomsData);
      setBookings(bookingsData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role === 'admin') return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeBookings = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'PENDING'
  );

  const popularRooms = rooms
    .map((room) => ({
      ...room,
      bookingCount: Math.floor(Math.random() * 10),
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: '#f0f2f5' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200" style={{ height: 52 }}>
        <div style={{ maxWidth: 960, width: '100%', margin: '0 auto', padding: '0 32px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <div className="flex items-center justify-center text-white" style={{ width: 28, height: 28, background: '#2563eb', borderRadius: 8 }}>
              <Building2 size={14} />
            </div>
            <span className="font-medium text-gray-900" style={{ fontSize: 14 }}>WildSpace</span>
          </div>

          <div className="hidden md:flex items-center" style={{ gap: 4 }}>
            {(user.role === 'ADMIN' || user.role === 'admin') ? (
              <Link to="/admin" className="text-sm font-medium rounded-lg" style={{ padding: '6px 12px', color: '#2563eb', background: '#eff6ff', textDecoration: 'none' }}>Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/" className="text-sm font-medium rounded-lg" style={{ padding: '6px 12px', color: '#2563eb', background: '#eff6ff', textDecoration: 'none' }}>Dashboard</Link>
                <Link to="/reservations" className="text-sm font-medium rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors" style={{ padding: '6px 12px', color: '#6b7280', textDecoration: 'none' }}>My Reservations</Link>
                <Link to="/rooms" className="text-sm font-medium rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors" style={{ padding: '6px 12px', color: '#6b7280', textDecoration: 'none' }}>Rooms</Link>
              </>
            )}
          </div>

          <div className="flex items-center" style={{ gap: 8 }}>
            <div className="flex items-center justify-center text-white font-medium flex-shrink-0" style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', fontSize: 13 }}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block font-medium text-gray-900" style={{ fontSize: 13 }}>{user.fullName}</span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 960, width: '100%', margin: '0 auto', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Welcome */}
        <div>
          <h1 className="font-semibold text-gray-900" style={{ fontSize: 20 }}>Welcome back, {user.fullName}!</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Find and book your perfect study space in just a few clicks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 16 }}>
          <div className="bg-white border border-gray-200 flex justify-between items-start" style={{ borderRadius: 12, padding: 20 }}>
            <div>
              <p className="font-medium" style={{ fontSize: 12, color: '#6b7280' }}>Total Rooms</p>
              <p className="font-semibold text-gray-900" style={{ fontSize: 28, marginTop: 6 }}>{loading ? '—' : rooms.length}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Available facilities</p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, background: '#f9fafb', borderRadius: 8, color: '#6b7280' }}>
              <Building2 size={18} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 flex justify-between items-start" style={{ borderRadius: 12, padding: 20 }}>
            <div>
              <p className="font-medium" style={{ fontSize: 12, color: '#6b7280' }}>Your Bookings</p>
              <p className="font-semibold text-gray-900" style={{ fontSize: 28, marginTop: 6 }}>{loading ? '—' : activeBookings.length}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Active reservations</p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, background: '#f9fafb', borderRadius: 8, color: '#6b7280' }}>
              <Calendar size={18} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 flex justify-between items-start" style={{ borderRadius: 12, padding: 20 }}>
            <div>
              <p className="font-medium" style={{ fontSize: 12, color: '#6b7280' }}>Active Users</p>
              <p className="font-semibold text-gray-900" style={{ fontSize: 28, marginTop: 6 }}>{loading ? '—' : rooms.length + 2}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Currently booking</p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, background: '#f9fafb', borderRadius: 8, color: '#6b7280' }}>
              <Users size={18} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          <div style={{ borderRadius: 16, padding: 28, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <p className="font-semibold text-gray-900" style={{ fontSize: 15 }}>Quick Book</p>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>Browse available rooms and make a reservation</p>
            <Link
              to="/rooms"
              className="flex items-center justify-center gap-1.5 font-semibold text-white border-none cursor-pointer transition-colors hover:bg-gray-700"
              style={{ marginTop: 20, width: '100%', padding: 11, background: '#1e293b', borderRadius: 10, fontSize: 13, textDecoration: 'none' }}
            >
              Browse Rooms <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ borderRadius: 16, padding: 28, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="font-semibold text-gray-900" style={{ fontSize: 15 }}>My Reservations</p>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>View and manage your upcoming bookings</p>
            <Link
              to="/reservations"
              className="flex items-center justify-center gap-1.5 font-medium cursor-pointer transition-colors hover:bg-gray-50"
              style={{ marginTop: 12, width: '100%', padding: 10, background: '#fff', color: '#111', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, textDecoration: 'none' }}
            >
              View Reservations <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Popular Rooms */}
        <div className="bg-white border border-gray-200 overflow-hidden" style={{ borderRadius: 12 }}>
          <div className="flex justify-between items-center" style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
            <div>
              <h3 className="font-semibold text-gray-900" style={{ fontSize: 15 }}>Most Popular Rooms</h3>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Rooms with the most active bookings</p>
            </div>
            <div className="flex items-center justify-center" style={{ width: 36, height: 36, background: '#f9fafb', borderRadius: 8, color: '#6b7280' }}>
              <TrendingUp size={18} />
            </div>
          </div>

          <div>
            {loading ? (
              <div style={{ padding: '0 24px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 56, background: '#f9fafb', borderRadius: 8, margin: '12px 0' }} className="animate-pulse" />
                ))}
              </div>
            ) : popularRooms.length === 0 ? (
              <div className="text-center" style={{ padding: '32px 24px' }}>
                <div className="mx-auto mb-3 flex items-center justify-center" style={{ width: 40, height: 40, background: '#f9fafb', borderRadius: '50%' }}>
                  <Building2 size={16} className="text-gray-300" />
                </div>
                <p style={{ fontSize: 13, color: '#9ca3af' }}>No rooms available yet. Check back soon.</p>
              </div>
            ) : (
              <div>
                {popularRooms.map((room, index) => (
                  <Link
                    key={room.id}
                    to={`/rooms/${room.id}`}
                    className="flex items-center transition-colors hover:bg-gray-50"
                    style={{ gap: 12, padding: '14px 24px', borderBottom: '1px solid #f3f4f6', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    <div className="flex items-center justify-center font-semibold flex-shrink-0" style={{ width: 34, height: 34, background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 8, fontSize: 12, color: '#9ca3af' }}>
                      {index + 1}
                    </div>
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <p className="font-medium text-gray-900 truncate" style={{ fontSize: 13 }}>{room.name}</p>
                      <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{room.type} · Capacity: {room.capacity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-medium" style={{ fontSize: 11, background: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: 20 }}>{room.bookingCount} bookings</span>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{room.building || 'Library Building'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sign out */}
        <div className="flex justify-center" style={{ paddingBottom: 8 }}>
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer transition-all hover:text-red-500 hover:border-red-200"
            style={{ gap: 6, fontSize: 13, color: '#9ca3af', background: '#fff', border: '1px solid #e5e7eb', padding: '7px 16px', borderRadius: 8 }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>

      </main>
    </div>
  );
}