import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, ChevronLeft, MapPin, Users, DollarSign, Calendar, Clock } from 'lucide-react';
import bookingAPI from '../services/bookingService';
import { toast } from 'sonner';

interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: string;
  location: string;
  pricePerHour: number;
  description?: string;
}

export default function BookRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadRooms();
  }, [user, navigate]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const availableRooms = await bookingAPI.getAvailableRooms();
      setRooms(availableRooms);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedRoom || !startTime || !endTime) return 0;
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    const hours = end - start;
    return hours > 0 ? hours * selectedRoom.pricePerHour : 0;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoom || !startDate || !startTime || !endTime) {
      toast.error('Please fill in all fields');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`).getTime();
    const endDateTime = new Date(`${startDate}T${endTime}`).getTime();

    if (startDateTime >= endDateTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      setBooking(true);
      await bookingAPI.createBooking(
        selectedRoom.id,
        startDateTime,
        endDateTime,
        notes
      );
      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBooking(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Book a Room</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rooms List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading rooms...</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No rooms available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                        selectedRoom?.id === room.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{room.name}</h3>
                          <p className="text-gray-600 text-sm">{room.type}</p>
                        </div>
                        <span className="text-lg font-bold text-blue-600">₱{room.pricePerHour.toFixed(2)}/hr</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="h-4 w-4" />
                          {room.building}, Floor {room.floor}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          Capacity: {room.capacity}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {room.location}
                        </div>
                      </div>

                      {room.description && (
                        <p className="text-gray-600 text-sm mt-3">{room.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>

              <form onSubmit={handleBooking} className="space-y-6">
                {/* Selected Room */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Selected Room
                  </label>
                  <div className={`p-4 rounded-lg border-2 ${
                    selectedRoom ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    {selectedRoom ? (
                      <div>
                        <p className="font-bold text-gray-900">{selectedRoom.name}</p>
                        <p className="text-sm text-gray-600">₱{selectedRoom.pricePerHour.toFixed(2)}/hour</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Please select a room above</p>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Time Range */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Time Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                    <span className="flex items-center text-gray-600">to</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special requirements or notes..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                {/* Total Price */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Total Price
                    </span>
                    <span className="text-2xl font-bold text-blue-600">₱{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedRoom || booking || !startDate || !startTime || !endTime}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                    !selectedRoom || booking || !startDate || !startTime || !endTime
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
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
