import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Calendar, Clock, MapPin, ArrowRight, XCircle, CheckCircle, Clock4 } from 'lucide-react';
import bookingAPI from '../services/bookingService';
import { toast } from 'sonner';

interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  startTime: number;
  endTime: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  createdAt: number;
}

export default function Reservations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await bookingAPI.getUserBookings();
      setBookings(bookingsData);
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await bookingAPI.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      loadBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const now = Date.now();
  
  const upcomingBookings = bookings.filter(b => b.endTime > now && b.status !== 'CANCELLED');
  const pastBookings = bookings.filter(b => b.endTime <= now || b.status === 'CANCELLED');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
            <CheckCircle className="h-4 w-4" />
            Confirmed
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">
            <Clock4 className="h-4 w-4" />
            Pending
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center gap-1.5 bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
            <XCircle className="h-4 w-4" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Navigation */}
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
              to="/dashboard"
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/reservations"
              className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium"
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-10" style={{ margin: '0 auto' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">My Reservations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your room bookings in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading reservations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && (activeTab === 'upcoming' ? upcomingBookings : pastBookings).length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming reservations" 
                : "No past reservations found"}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Browse Rooms
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}

        {/* Bookings List */}
        {!loading && (
          <div className="space-y-4">
            {(activeTab === 'upcoming' ? upcomingBookings : pastBookings).map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left - Room Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{booking.roomName}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(booking.startTime)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        Room ID: {booking.roomId}
                      </div>
                    </div>
                  </div>

                  {/* Right - Price & Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₱{booking.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Booked {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {activeTab === 'upcoming' && booking.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
