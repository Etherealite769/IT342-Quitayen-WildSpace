import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Calendar, LogOut, Plus, Clock, MapPin } from 'lucide-react';
import bookingAPI from '../services/bookingService';
import { toast } from 'sonner';

interface Booking {
  id: string;
  roomName: string;
  startTime: number;
  endTime: number;
  status: string;
  totalPrice: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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
      const userBookings = await bookingAPI.getUserBookings();
      setBookings(userBookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingBookings = bookings.filter(b => b.status !== 'CANCELLED' && new Date(b.startTime).getTime() > Date.now());
  const pastBookings = bookings.filter(b => b.status !== 'CANCELLED' && new Date(b.startTime).getTime() <= Date.now());

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">WildSpace</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.fullName}!</h2>
              <p className="text-gray-600 mt-2">Student ID: {user.studentId}</p>
            </div>
            <Link
              to="/book"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              <Plus className="h-5 w-5" />
              Book a Room
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingBookings.length}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
              </div>
              <Building2 className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₱{bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
                </p>
              </div>
              <Building2 className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Bookings</h3>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No bookings yet</p>
              <p className="text-gray-500 mb-6">Start by booking a room for your next event</p>
              <Link
                to="/book"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Book Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upcoming */}
              {upcomingBookings.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Upcoming</h4>
                  <div className="space-y-3">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900">{booking.roomName}</h5>
                            <div className="flex items-center gap-4 mt-2 text-gray-600 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDate(booking.startTime)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                to {formatDate(booking.endTime)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <p className="text-gray-900 font-semibold mt-2">₱{booking.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past */}
              {pastBookings.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Past Bookings</h4>
                  <div className="space-y-3">
                    {pastBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-700">{booking.roomName}</h5>
                            <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDate(booking.startTime)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <p className="text-gray-700 font-semibold mt-2">₱{booking.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2026 WildSpace. Campus Facility Management System.
        </div>
      </footer>
    </div>
  );
}
