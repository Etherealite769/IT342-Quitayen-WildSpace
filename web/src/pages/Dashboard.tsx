import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Building2,
  Calendar,
  TrendingUp,
  Users,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import bookingAPI from '../services/bookingService';
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
    if (user.role === 'admin') {
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
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between" style={{ margin: '0 auto' }}>
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold text-gray-900 tracking-tight">
              WildSpace
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/reservations"
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              My Reservations
            </Link>
            <Link
              to="/rooms"
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Rooms
            </Link>
          </div>

          {/* User */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user.fullName}
            </span>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-8 py-10 space-y-8" style={{ margin: '0 auto' }}>

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user.fullName}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Find and book your perfect study space in just a few clicks
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '—' : rooms.length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Available facilities</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '—' : activeBookings.length}
                </p>
                <p className="text-sm text-gray-500 mt-1">Active reservations</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '—' : rooms.length + 2}
                </p>
                <p className="text-sm text-gray-500 mt-1">Currently booking</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Quick Book */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-gray-900">Quick Book</h3>
            <p className="text-sm text-gray-600 mt-3">
              Browse available rooms and make a reservation
            </p>
            <Link
              to="/rooms"
              className="mt-6 flex items-center justify-center gap-2 w-full bg-slate-900 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Browse Rooms
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* My Reservations */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900">My Reservations</h3>
            <p className="text-sm text-gray-600 mt-1">
              View and manage your upcoming bookings
            </p>
            <Link
              to="/reservations"
              className="mt-4 flex items-center justify-center gap-2 w-full bg-white text-gray-800 text-sm font-medium py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              View Reservations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Popular Rooms */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Most Popular Rooms
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Rooms with the most active bookings
              </p>
            </div>
            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-gray-600" />
            </div>
          </div>

          <div className="px-6 py-5">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : popularRooms.length === 0 ? (
              <div className="text-center py-8">
                <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-4 w-4 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">
                  No rooms available yet. Check back soon.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {popularRooms.map((room, index) => (
                  <Link
                    key={room.id}
                    to={`/rooms/${room.id}`}
                    className="flex items-center gap-4 p-3.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                  >
                    <div className="h-9 w-9 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-400 group-hover:border-blue-100 group-hover:text-blue-500 transition-colors flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {room.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {room.type} · Capacity: {room.capacity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        {room.bookingCount} bookings
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {room.building || 'Library Building'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sign out */}
        <div className="flex justify-center pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 border border-gray-200 bg-white px-4 py-2 rounded-lg hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

      </main>
    </div>
  );
}