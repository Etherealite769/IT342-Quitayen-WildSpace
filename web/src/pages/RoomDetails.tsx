import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Users, MapPin, ArrowLeft, ChevronLeft, Calendar, Clock } from 'lucide-react';
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
  amenities?: string[];
  imageUrl?: string;
}

export default function RoomDetails() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Booking form state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [purpose, setPurpose] = useState('');

  // Generate time slots from 9 AM to 9 PM
  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (roomId) {
      loadRoom();
    }
  }, [user, navigate, roomId]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      const roomData = await bookingAPI.getRoomById(roomId!);
      // Add default image and amenities if not present
      const enhancedRoom = {
        ...roomData,
        imageUrl: roomData.imageUrl || getImageByType(roomData.type),
        amenities: roomData.amenities || getAmenitiesByType(roomData.type),
      };
      setRoom(enhancedRoom);
    } catch (error) {
      toast.error('Failed to load room details');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const getImageByType = (type: string) => {
    const images: Record<string, string> = {
      'Discussion Room': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'Lecture Hall': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
      'Laboratory': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
      'Computer Lab': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      'Study Room': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
    };
    return images[type] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
  };

  const getAmenitiesByType = (type: string) => {
    const amenities: Record<string, string[]> = {
      'Discussion Room': ['Whiteboard', 'TV Display', 'HDMI Cable'],
      'Lecture Hall': ['Projector', 'Sound System', 'Microphone'],
      'Laboratory': ['Lab Equipment', 'Safety Cabinets', 'Microscope'],
      'Computer Lab': ['Computers', 'Printers', 'High-speed WiFi'],
      'Study Room': ['Quiet Space', 'Reading Lights', 'Power Outlets'],
    };
    return amenities[type] || ['Basic Equipment'];
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select a date and time slot');
      return;
    }

    const [startTime] = selectedSlot.split(' - ');
    const [endTime] = selectedSlot.split(' - ').slice(1);
    
    const startDateTime = new Date(`${selectedDate}T${startTime}`).getTime();
    const endDateTime = new Date(`${selectedDate}T${endTime}`).getTime();

    try {
      setBooking(true);
      await bookingAPI.createBooking(
        roomId!,
        startDateTime,
        endDateTime,
        purpose
      );
      toast.success('Booking confirmed successfully!');
      navigate('/reservations');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBooking(false);
    }
  };

  // Generate calendar days for April 2026
  const generateCalendarDays = () => {
    const days = [];
    // Previous month days
    for (let i = 29; i <= 31; i++) {
      days.push({ day: i, month: 'prev' });
    }
    // Current month days
    for (let i = 1; i <= 30; i++) {
      days.push({ day: i, month: 'current', isToday: i === 11 });
    }
    // Next month days
    for (let i = 1; i <= 2; i++) {
      days.push({ day: i, month: 'next' });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between" style={{ margin: '0 auto' }}>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold text-gray-900 tracking-tight">WildSpace</span>
            </div>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-8 py-10 flex justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between" style={{ margin: '0 auto' }}>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold text-gray-900 tracking-tight">WildSpace</span>
            </div>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-8 py-10 text-center">
          <p className="text-gray-600">Room not found</p>
          <Link to="/rooms" className="mt-4 text-blue-600 font-medium">Back to Rooms</Link>
        </div>
      </div>
    );
  }

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
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              My Reservations
            </Link>
            <Link
              to="/rooms"
              className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium"
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
        {/* Back Button */}
        <button
          onClick={() => navigate('/rooms')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Rooms</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Image */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="relative h-80 lg:h-96">
                <img
                  src={room.imageUrl}
                  alt={room.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
                  }}
                />
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{room.name}</h1>
                  <p className="text-gray-500 mt-1">{room.id} • {room.type}</p>
                </div>
                <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                  {room.type}
                </span>
              </div>

              <p className="text-gray-600 mb-6">
                {room.description || `A modern ${room.type.toLowerCase()} perfect for group study sessions and collaborative work.`}
              </p>

              {/* Room Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span>Capacity: {room.capacity} people</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{room.building}, Floor {room.floor}</span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities?.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Book This Room</h2>
              <p className="text-sm text-gray-500 mb-6">Select a date and time slot</p>

              <form onSubmit={handleBooking} className="space-y-6">
                {/* Date Picker */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                    <Calendar className="h-4 w-4" />
                    Select Date
                  </label>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button type="button" className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft className="h-4 w-4 text-gray-400" />
                      </button>
                      <span className="text-sm font-medium text-gray-900">April 2026</span>
                      <button type="button" className="p-1 hover:bg-gray-100 rounded">
                        <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                      <span className="text-gray-400">Su</span>
                      <span className="text-gray-400">Mo</span>
                      <span className="text-gray-400">Tu</span>
                      <span className="text-gray-400">We</span>
                      <span className="text-gray-400">Th</span>
                      <span className="text-gray-400">Fr</span>
                      <span className="text-gray-400">Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => day.month === 'current' && setSelectedDate(`2026-04-${day.day.toString().padStart(2, '0')}`)}
                          className={`
                            aspect-square flex items-center justify-center text-sm rounded-lg
                            ${day.month !== 'current' ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}
                            ${day.isToday ? 'bg-slate-900 text-white hover:bg-slate-800' : ''}
                            ${selectedDate === `2026-04-${day.day.toString().padStart(2, '0')}` && !day.isToday ? 'bg-blue-100 text-blue-700' : ''}
                          `}
                        >
                          {day.day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                    <Clock className="h-4 w-4" />
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`
                          py-2 px-3 text-sm rounded-lg border transition-colors
                          ${selectedSlot === slot 
                            ? 'bg-slate-900 text-white border-slate-900' 
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Purpose of Booking
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g., Group study for Math exam, Team project meeting..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={booking || !selectedDate || !selectedSlot}
                  className={`
                    w-full py-3 rounded-xl font-semibold text-white transition-colors
                    ${!selectedDate || !selectedSlot || booking
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800'}
                  `}
                >
                  {booking ? 'Confirming...' : 'Confirm Booking'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By booking, you agree to follow all facility rules and regulations
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
