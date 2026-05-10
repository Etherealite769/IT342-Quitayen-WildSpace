import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { Building2, Users, MapPin, ArrowRight } from 'lucide-react';
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

export default function Rooms() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadRooms();
  }, [user, navigate]);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchQuery, selectedType]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await bookingAPI.getAllRooms();
      // Use backend data if available, otherwise fallback to defaults
      const enhancedRooms = roomsData.map((room: Room) => ({
        ...room,
        amenities: room.amenities || getAmenitiesByType(room.type),
        imageUrl: room.imageUrl || getImageByType(room.type),
      }));
      setRooms(enhancedRooms);
      setFilteredRooms(enhancedRooms);
    } catch (error: any) {
      console.error('Failed to load rooms:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const getAmenitiesByType = (type: string) => {
    const amenities: Record<string, string[]> = {
      'Discussion Room': ['Whiteboard', 'TV Display'],
      'Lecture Hall': ['Projector', 'Sound System'],
      'Laboratory': ['Lab Equipment', 'Safety Cabinets'],
      'Computer Lab': ['Computers', 'Printers'],
      'Study Room': ['Quiet Space', 'Reading Lights'],
    };
    return amenities[type] || ['Basic Equipment'];
  };

  const getImageByType = (type: string) => {
    // Using placeholder images based on room type
    const images: Record<string, string> = {
      'Discussion Room': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'Lecture Hall': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
      'Laboratory': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
      'Computer Lab': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      'Study Room': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
    };
    return images[type] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
  };

  const filterRooms = () => {
    let filtered = rooms;
    
    if (searchQuery) {
      filtered = filtered.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedType !== 'All') {
      filtered = filtered.filter(room => room.type === selectedType);
    }
    
    setFilteredRooms(filtered);
  };

  const roomTypes = ['All', ...new Set(rooms.map(r => r.type))];

  if (!user) return null;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
  };

  return (
    <div className="min-h-screen" style={{ background: '#f0f2f5' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ height: 52 }}>
        <div style={{ maxWidth: 960, width: '100%', margin: '0 auto', padding: '0 32px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <div className="flex items-center justify-center text-white" style={{ width: 28, height: 28, background: '#2563eb', borderRadius: 8 }}>
              <Building2 size={14} />
            </div>
            <span className="font-semibold text-gray-900" style={{ fontSize: 15 }}>WildSpace</span>
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
            <div className="flex items-center justify-center text-white font-semibold" style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', fontSize: 13 }}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block font-medium" style={{ fontSize: 13, color: '#6b7280' }}>{user.fullName}</span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 960, width: '100%', margin: '0 auto', padding: '32px' }}>
        <div className="font-semibold text-gray-900" style={{ fontSize: 22, marginBottom: 4 }}>Browse rooms</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>Find the perfect space for your needs</div>

        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 flex items-center" style={{ borderRadius: 12, padding: '16px 20px', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search rooms by name, building, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200"
              style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, background: '#fff', color: '#111827', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s' }}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-200"
            style={{ padding: '9px 16px', borderRadius: 8, fontSize: 13, background: '#fff', color: '#111827', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}
          >
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
          Showing {filteredRooms.length} of {rooms.length} rooms
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center" style={{ padding: '48px 20px' }}>
            <div className="animate-spin" style={{ width: 32, height: 32, border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
            <p style={{ fontSize: 14, color: '#6b7280', marginTop: 16 }}>Loading rooms...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRooms.length === 0 && (
          <div className="bg-white border border-gray-200 text-center" style={{ borderRadius: 12, padding: '48px 20px' }}>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>No rooms found matching your criteria</p>
            <button onClick={clearFilters} className="border-none cursor-pointer" style={{ fontSize: 13, color: '#2563eb', background: 'none' }}>
              Clear filters
            </button>
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && filteredRooms.length > 0 && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {filteredRooms.map((room) => (
                <div key={room.id} className="bg-white border border-gray-200 overflow-hidden" style={{ borderRadius: 12, transition: 'box-shadow 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div className="relative overflow-hidden" style={{ height: 160, background: '#f3f4f6' }}>
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span className="font-medium" style={{ position: 'absolute', top: 10, right: 10, background: '#0f172a', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>{room.type}</span>
                  </div>
                  <div style={{ padding: 18 }}>
                    <div className="font-semibold text-gray-900" style={{ fontSize: 15, marginBottom: 3 }}>{room.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>{room.id}</div>
                    <div className="flex flex-col" style={{ gap: 7, marginBottom: 12 }}>
                      <div className="flex items-center" style={{ gap: 7, fontSize: 13, color: '#4b5563' }}>
                        <Users size={16} className="flex-shrink-0" style={{ color: '#9ca3af' }} />
                        Capacity: {room.capacity} people
                      </div>
                      <div className="flex items-center" style={{ gap: 7, fontSize: 13, color: '#4b5563' }}>
                        <MapPin size={16} className="flex-shrink-0" style={{ color: '#9ca3af' }} />
                        {room.building}, Floor {room.floor}
                      </div>
                    </div>
                    <div className="flex flex-wrap" style={{ gap: 6, marginBottom: 14 }}>
                      {room.amenities?.map((amenity) => (
                        <span key={amenity} className="font-medium" style={{ fontSize: 11, background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 6 }}>{amenity}</span>
                      ))}
                    </div>
                    <Link
                      to={`/rooms/${room.id}`}
                      className="w-full flex items-center justify-center font-semibold border-none cursor-pointer transition-colors"
                      style={{ padding: 10, background: '#0f172a', color: '#fff', borderRadius: 10, fontSize: 13, gap: 6, textDecoration: 'none' }}
                    >
                      View details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
