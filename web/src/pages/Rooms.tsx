import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Users, MapPin, Search, Filter, ArrowRight } from 'lucide-react';
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
    } catch (error) {
      toast.error('Failed to load rooms');
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Browse Rooms</h1>
          <p className="mt-1 text-sm text-gray-500">
            Find the perfect space for your needs
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            
            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer"
              >
                {roomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-6">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </p>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading rooms...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRooms.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No rooms found matching your criteria</p>
            <button
              onClick={() => {setSearchQuery(''); setSelectedType('All');}}
              className="mt-4 text-blue-600 text-sm font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-slate-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {room.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{room.id}</p>

                  {/* Details */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Capacity: {room.capacity} people</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{room.building}, Floor {room.floor}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {room.amenities?.slice(0, 2).map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities && room.amenities.length > 2 && (
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        +{room.amenities.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Button */}
                  <Link
                    to={`/rooms/${room.id}`}
                    className="mt-5 w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-semibold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
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
