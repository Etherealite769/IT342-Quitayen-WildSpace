import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
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

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;
  const isPast = activeTab === 'past';

  if (!user) return null;

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
                <Link to="/" className="text-sm font-medium rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors" style={{ padding: '6px 12px', color: '#6b7280', textDecoration: 'none' }}>Dashboard</Link>
                <Link to="/reservations" className="text-sm font-medium rounded-lg" style={{ padding: '6px 12px', color: '#2563eb', background: '#eff6ff', textDecoration: 'none' }}>My Reservations</Link>
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
      <main style={{ maxWidth: 960, width: '100%', margin: '0 auto', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div>
          <h1 className="font-semibold text-gray-900" style={{ fontSize: 20 }}>My Reservations</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Manage all your room bookings in one place</p>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ gap: 8 }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            className="font-medium cursor-pointer border-none transition-colors"
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 13,
              background: activeTab === 'upcoming' ? '#1e293b' : '#fff',
              color: activeTab === 'upcoming' ? '#fff' : '#6b7280',
              border: activeTab === 'upcoming' ? 'none' : '1px solid #e5e7eb',
            }}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className="font-medium cursor-pointer border-none transition-colors"
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 13,
              background: activeTab === 'past' ? '#1e293b' : '#fff',
              color: activeTab === 'past' ? '#fff' : '#6b7280',
              border: activeTab === 'past' ? 'none' : '1px solid #e5e7eb',
            }}
          >
            Past ({pastBookings.length})
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center" style={{ padding: '48px 0' }}>
            <div className="animate-spin mx-auto" style={{ width: 32, height: 32, border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 16 }}>Loading reservations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayBookings.length === 0 && (
          <div className="bg-white border border-gray-200 text-center" style={{ borderRadius: 12, padding: '64px 24px' }}>
            <div className="mx-auto flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: '50%', background: '#f9fafb', marginBottom: 16 }}>
              <Calendar size={22} className="text-gray-300" />
            </div>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
              {activeTab === 'upcoming' ? "You don't have any upcoming reservations" : "No past reservations found"}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                to="/rooms"
                className="inline-flex items-center font-medium transition-colors hover:bg-gray-700"
                style={{ gap: 6, background: '#1e293b', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, textDecoration: 'none' }}
              >
                Browse Rooms <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}

        {/* Bookings List */}
        {!loading && displayBookings.length > 0 && (
          <div className="flex flex-col" style={{ gap: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
              {activeTab === 'upcoming' ? 'Upcoming bookings' : 'Past bookings'}
            </p>
            {displayBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 transition-shadow"
                style={{
                  borderRadius: 12,
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 16,
                  opacity: isPast || booking.status === 'CANCELLED' ? 0.72 : 1,
                }}
              >
                {/* Left */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center" style={{ justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
                    <span className="font-semibold text-gray-900" style={{ fontSize: 15 }}>{booking.roomName}</span>
                    <span
                      className="inline-flex items-center font-medium flex-shrink-0"
                      style={{
                        gap: 5,
                                                        fontSize: 11,
                                                        padding: '3px 10px',
                                                        borderRadius: 20,
                                                        background: booking.status === 'CONFIRMED' ? '#dcfce7' : booking.status === 'PENDING' ? '#fef9c3' : '#fee2e2',
                                                        color: booking.status === 'CONFIRMED' ? '#15803d' : booking.status === 'PENDING' ? '#a16207' : '#b91c1c',
                                                      }}
                                                    >
                      {booking.status === 'CONFIRMED' ? <CheckCircle size={12} /> : booking.status === 'PENDING' ? <Clock4 size={12} /> : <XCircle size={12} />}
                      {booking.status === 'CONFIRMED' ? 'Confirmed' : booking.status === 'PENDING' ? 'Pending' : 'Cancelled'}
                    </span>
                  </div>
                  <div className="flex flex-wrap" style={{ gap: 14 }}>
                    <span className="inline-flex items-center" style={{ gap: 5, fontSize: 12, color: '#6b7280' }}>
                      <Calendar size={14} className="text-gray-400" /> {formatDate(booking.startTime)}
                    </span>
                    <span className="inline-flex items-center" style={{ gap: 5, fontSize: 12, color: '#6b7280' }}>
                      <Clock size={14} className="text-gray-400" /> {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    </span>
                    <span className="inline-flex items-center" style={{ gap: 5, fontSize: 12, color: '#6b7280' }}>
                      <MapPin size={14} className="text-gray-400" /> Room ID: {booking.roomId}
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center flex-shrink-0" style={{ gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <p className="font-semibold text-gray-900" style={{ fontSize: 15 }}>₱{booking.totalPrice.toFixed(2)}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>Booked {new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  {activeTab === 'upcoming' && booking.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="font-medium cursor-pointer transition-colors"
                      style={{ padding: '6px 14px', border: '1px solid #fca5a5', color: '#b91c1c', background: 'transparent', borderRadius: 8, fontSize: 12 }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
