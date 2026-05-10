import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Building2, Users, MapPin, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import bookingAPI from '../../booking/services/bookingService';
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

  // Calendar view state
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

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

  const generateCalendarDays = (year: number, month: number) => {
    const days: { day: number; month: 'prev' | 'current' | 'next' }[] = [];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: prevMonthDays - firstDay + 1 + i, month: 'prev' });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, month: 'current' });
    }
    const total = firstDay + daysInMonth;
    const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: 'next' });
    }
    return days;
  };

  const calendarDays = generateCalendarDays(viewYear, viewMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handlePrevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  };

  const handleNextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#f0f2f5' }}>
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ height: 52 }}>
          <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', padding: '0 32px', height: '100%', display: 'flex', alignItems: 'center' }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <div className="flex items-center justify-center text-white" style={{ width: 28, height: 28, background: '#2563eb', borderRadius: 8 }}>
                <Building2 size={14} />
              </div>
              <span className="font-semibold text-gray-900" style={{ fontSize: 15, letterSpacing: '-0.01em' }}>WildSpace</span>
            </div>
          </div>
        </nav>
        <div className="flex justify-center" style={{ padding: '48px 32px' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen" style={{ background: '#f0f2f5' }}>
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ height: 52 }}>
          <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', padding: '0 32px', height: '100%', display: 'flex', alignItems: 'center' }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <div className="flex items-center justify-center text-white" style={{ width: 28, height: 28, background: '#2563eb', borderRadius: 8 }}>
                <Building2 size={14} />
              </div>
              <span className="font-semibold text-gray-900" style={{ fontSize: 15, letterSpacing: '-0.01em' }}>WildSpace</span>
            </div>
          </div>
        </nav>
        <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', padding: '48px 32px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Room not found</p>
          <Link to="/rooms" className="inline-block font-medium transition-colors hover:text-blue-700" style={{ marginTop: 16, fontSize: 14, color: '#2563eb', textDecoration: 'none' }}>Back to Rooms</Link>
        </div>
      </div>
    );
  }

  const canConfirm = selectedDate && selectedSlot;

  return (
    <div className="min-h-screen" style={{ background: '#f0f2f5' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ height: 52 }}>
        <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', padding: '0 32px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <div className="flex items-center justify-center text-white" style={{ width: 28, height: 28, background: '#2563eb', borderRadius: 8 }}>
              <Building2 size={14} />
            </div>
            <span className="font-semibold text-gray-900" style={{ fontSize: 15, letterSpacing: '-0.01em' }}>WildSpace</span>
          </div>

          <div className="hidden md:flex items-center" style={{ gap: 4 }}>
            {(user.role === 'ADMIN' || user.role === 'admin') ? (
              <Link to="/admin" className="text-sm font-medium rounded-lg" style={{ padding: '6px 12px', color: '#2563eb', background: '#eff6ff', textDecoration: 'none' }}>Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/" className="text-sm font-medium rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors" style={{ padding: '6px 12px', color: '#6b7280', textDecoration: 'none' }}>Dashboard</Link>
                <Link to="/reservations" className="text-sm font-medium rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors" style={{ padding: '6px 12px', color: '#6b7280', textDecoration: 'none' }}>My Reservations</Link>
                <Link to="/rooms" className="text-sm font-medium rounded-lg" style={{ padding: '6px 12px', color: '#2563eb', background: '#eff6ff', textDecoration: 'none' }}>Rooms</Link>
              </>
            )}
          </div>

          <div className="flex items-center" style={{ gap: 8 }}>
            <div className="flex items-center justify-center text-white font-semibold flex-shrink-0" style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', fontSize: 13 }}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block font-medium" style={{ fontSize: 13, color: '#6b7280' }}>{user.fullName}</span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 1000, width: '100%', margin: '0 auto', padding: '28px 32px 48px' }}>
        {/* Back */}
        <button
          onClick={() => navigate('/rooms')}
          className="inline-flex items-center font-medium border-none cursor-pointer transition-colors hover:text-gray-900"
          style={{ gap: 6, fontSize: 13, color: '#6b7280', background: 'none', padding: 0, marginBottom: 20 }}
        >
          <ChevronLeft size={18} />
          Back to Rooms
        </button>

        <div className="grid" style={{ gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          {/* LEFT */}
          <div className="flex flex-col" style={{ gap: 16 }}>
            {/* Image */}
            <div className="bg-white border border-gray-200 overflow-hidden" style={{ borderRadius: 16 }}>
              <img
                src={room.imageUrl}
                alt={room.name}
                style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.height = '200px';
                  target.style.background = '#f3f4f6';
                  target.removeAttribute('src');
                }}
              />
            </div>

            {/* Info Card */}
            <div className="bg-white border border-gray-200" style={{ borderRadius: 16, padding: 24 }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
                <div>
                  <div className="font-semibold text-gray-900" style={{ fontSize: 20 }}>{room.name}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>{room.id} · {room.type}</div>
                </div>
                <span className="font-medium" style={{ fontSize: 12, background: '#f3f4f6', color: '#6b7280', padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>{room.type}</span>
              </div>

              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65, marginBottom: 18 }}>
                {room.description || `A modern ${room.type.toLowerCase()} perfect for group study sessions and collaborative work. Equipped with all the tools you need for productive meetings and presentations.`}
              </p>

              <div className="grid grid-cols-2" style={{ gap: 10, marginBottom: 18 }}>
                <div className="flex items-center" style={{ gap: 8, fontSize: 14, color: '#6b7280' }}>
                  <Users size={16} className="text-gray-400 flex-shrink-0" />
                  Capacity: {room.capacity} people
                </div>
                <div className="flex items-center" style={{ gap: 8, fontSize: 14, color: '#6b7280' }}>
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  {room.building}, Floor {room.floor}
                </div>
              </div>

              <div className="font-semibold text-gray-900" style={{ fontSize: 13, marginBottom: 10 }}>Available equipment</div>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {room.amenities?.map((amenity) => (
                  <span key={amenity} className="font-medium" style={{ fontSize: 13, background: '#f3f4f6', color: '#374151', padding: '6px 12px', borderRadius: 8 }}>{amenity}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: BOOKING */}
          <div className="bg-white border border-gray-200" style={{ borderRadius: 16, padding: 20, position: 'sticky', top: 68 }}>
            <div className="font-semibold text-gray-900" style={{ fontSize: 16, marginBottom: 4 }}>Book this room</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Select a date and time slot</div>

            <form onSubmit={handleBooking}>
              {/* DATE */}
              <div style={{ marginBottom: 16 }}>
                <div className="flex items-center font-semibold text-gray-900" style={{ gap: 6, fontSize: 13, marginBottom: 8 }}>
                  <Calendar size={14} className="text-gray-400" />
                  Select date
                </div>
                <div className="border border-gray-200" style={{ borderRadius: 12, padding: 12 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                    <button type="button" onClick={handlePrevMonth} className="flex items-center justify-center border-none cursor-pointer transition-colors" style={{ padding: 4, borderRadius: 6, color: '#9ca3af', background: 'none' }}>
                      <ChevronLeft size={14} />
                    </button>
                    <span className="font-semibold text-gray-900" style={{ fontSize: 13 }}>{monthNames[viewMonth]} {viewYear}</span>
                    <button type="button" onClick={handleNextMonth} className="flex items-center justify-center border-none cursor-pointer transition-colors" style={{ padding: 4, borderRadius: 6, color: '#9ca3af', background: 'none' }}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-center" style={{ marginBottom: 4 }}>
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
                      <span key={d} style={{ fontSize: 11, color: '#9ca3af', padding: '3px 0' }}>{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7" style={{ gap: 2 }}>
                    {calendarDays.map((d, i) => {
                      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
                      const isToday = d.month === 'current' && viewYear === todayY && viewMonth === todayM && d.day === todayD;
                      const isSelected = selectedDate === dateStr && d.month === 'current';
                      const isMuted = d.month !== 'current';
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => !isMuted && setSelectedDate(dateStr)}
                          className="flex items-center justify-center border-none cursor-pointer"
                          style={{
                            aspectRatio: '1',
                            fontSize: 12,
                            borderRadius: 6,
                            color: isMuted ? '#9ca3af' : isToday ? '#fff' : isSelected ? '#1d4ed8' : '#111827',
                            background: isToday ? '#1e293b' : isSelected ? '#dbeafe' : 'none',
                            pointerEvents: isMuted ? 'none' : 'auto',
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={(e) => { if (!isMuted && !isToday && !isSelected) e.currentTarget.style.background = '#f3f4f6'; }}
                          onMouseLeave={(e) => { if (!isMuted && !isToday && !isSelected) e.currentTarget.style.background = 'none'; }}
                        >
                          {d.day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* TIME SLOTS */}
              <div style={{ marginBottom: 16 }}>
                <div className="flex items-center font-semibold text-gray-900" style={{ gap: 6, fontSize: 13, marginBottom: 8 }}>
                  <Clock size={14} className="text-gray-400" />
                  Available time slots
                </div>
                <div className="grid grid-cols-2" style={{ gap: 6 }}>
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className="font-medium cursor-pointer text-center border transition-colors"
                      style={{
                        padding: '7px 4px',
                        fontSize: 12,
                        borderRadius: 8,
                        background: selectedSlot === slot ? '#1e293b' : '#fff',
                        color: selectedSlot === slot ? '#fff' : '#111827',
                        borderColor: selectedSlot === slot ? '#1e293b' : '#e5e7eb',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* PURPOSE */}
              <div style={{ marginBottom: 16 }}>
                <div className="font-semibold text-gray-900" style={{ fontSize: 13, marginBottom: 8 }}>Purpose of booking</div>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Group study for Math exam, Team project meeting..."
                  rows={3}
                  className="w-full border border-gray-200"
                  style={{ padding: '10px 12px', borderRadius: 8, fontSize: 13, color: '#111827', background: '#fff', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, transition: 'border-color 0.15s' }}
                />
              </div>

              {/* CONFIRM */}
              <button
                type="submit"
                disabled={booking || !canConfirm}
                className="w-full font-semibold border-none cursor-pointer transition-colors"
                style={{
                  padding: 12,
                  borderRadius: 10,
                  fontSize: 14,
                  background: canConfirm && !booking ? '#1e293b' : '#e5e7eb',
                  color: canConfirm && !booking ? '#fff' : '#9ca3af',
                  cursor: canConfirm && !booking ? 'pointer' : 'not-allowed',
                }}
              >
                {booking ? 'Confirming...' : 'Confirm booking'}
              </button>
              <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
                By booking, you agree to follow all facility rules and regulations
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
