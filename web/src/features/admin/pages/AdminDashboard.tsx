import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import {
  Building2, Trash2, Edit3, Plus,
  X, Calendar, Clock, LayoutDashboard, BookOpen, DoorOpen, CheckCircle, LogOut
} from 'lucide-react';
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
  available?: boolean;
}

interface Booking {
  id: string;
  userId: string;
  roomId: string;
  roomName: string;
  startTime: number;
  endTime: number;
  status: string;
  totalPrice: number;
  notes?: string;
  createdAt?: number;
}

const TAB_DASHBOARD = 'dashboard';
const TAB_RESERVATIONS = 'reservations';
const TAB_ROOMS = 'rooms';

const roomTypes = ['Discussion Room', 'Lecture Hall', 'Laboratory', 'Computer Lab', 'Study Room'];

const emptyRoom: Omit<Room, 'id'> = {
  name: '',
  building: '',
  floor: 1,
  capacity: 1,
  type: 'Discussion Room',
  location: '',
  pricePerHour: 0,
  description: '',
  amenities: [],
  imageUrl: '',
  available: true,
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const [activeTab, setActiveTab] = useState(TAB_DASHBOARD);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState<Omit<Room, 'id'>>(emptyRoom);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'ADMIN' && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, bookingsData] = await Promise.all([
        bookingAPI.getAllRooms(),
        bookingAPI.getAllBookings(),
      ]);
      setRooms(roomsData);
      setBookings(bookingsData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await bookingAPI.deleteRoom(id);
      toast.success('Room deleted');
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    }
  };

  const openAddRoom = () => {
    setEditingRoom(null);
    setRoomForm(emptyRoom);
    setShowRoomModal(true);
  };

  const openEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      type: room.type,
      location: room.location,
      pricePerHour: room.pricePerHour,
      description: room.description || '',
      amenities: room.amenities || [],
      imageUrl: room.imageUrl || '',
      available: room.available ?? true,
    });
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await bookingAPI.updateRoom(editingRoom.id, roomForm);
        toast.success('Room updated');
      } else {
        await bookingAPI.createRoom(roomForm);
        toast.success('Room created');
      }
      setShowRoomModal(false);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save room');
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await bookingAPI.updateBookingStatus(id, status);
      toast.success(`Booking ${status.toLowerCase()}`);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancelBooking(id);
      toast.success('Booking cancelled');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString();
  };

  const stats = {
    totalRooms: rooms.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
    confirmedBookings: bookings.filter((b) => b.status === 'CONFIRMED').length,
  };

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN' || user.role === 'admin';
  if (!isAdmin) return null;

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
            <span className="text-sm font-medium rounded-lg" style={{ padding: '6px 12px', color: '#2563eb', background: '#eff6ff', textDecoration: 'none' }}>Admin Dashboard</span>
          </div>

          <div className="flex items-center" style={{ gap: 8 }}>
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer transition-all hover:text-red-500 hover:border-red-200"
              style={{ gap: 5, fontSize: 12, color: '#9ca3af', background: '#fff', border: '1px solid #e5e7eb', padding: '5px 10px', borderRadius: 8 }}
            >
              <LogOut size={14} /> Sign out
            </button>
            <div className="flex items-center justify-center text-white font-semibold" style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', fontSize: 13 }}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block font-medium" style={{ fontSize: 13, color: '#6b7280' }}>{user.fullName}</span>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: 960, width: '100%', margin: '0 auto', padding: '32px' }}>
        <div className="font-semibold text-gray-900" style={{ fontSize: 22, marginBottom: 4 }}>Admin Panel</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>Manage rooms and monitor reservations</div>

        {/* Tabs */}
        <div className="flex items-center" style={{ gap: 8, marginBottom: 24 }}>
          {[
            { key: TAB_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
            { key: TAB_RESERVATIONS, label: 'Reservations', icon: BookOpen },
            { key: TAB_ROOMS, label: 'Rooms', icon: DoorOpen },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center font-medium border-none cursor-pointer transition-colors"
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                gap: 6,
                background: activeTab === tab.key ? '#eff6ff' : '#fff',
                color: activeTab === tab.key ? '#2563eb' : '#6b7280',
                border: activeTab === tab.key ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
              }}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center" style={{ padding: '48px 20px' }}>
            <div className="animate-spin" style={{ width: 32, height: 32, border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
            <p style={{ fontSize: 14, color: '#6b7280', marginTop: 16 }}>Loading...</p>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {!loading && activeTab === TAB_DASHBOARD && (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Rooms', value: stats.totalRooms, icon: DoorOpen, color: '#2563eb', bg: '#eff6ff' },
              { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: '#059669', bg: '#f0fdf4' },
              { label: 'Pending', value: stats.pendingBookings, icon: Clock, color: '#d97706', bg: '#fffbeb' },
              { label: 'Confirmed', value: stats.confirmedBookings, icon: CheckCircle, color: '#7c3aed', bg: '#f5f3ff' },
            ].map((stat) => (
              <div key={stat.label} className="border border-gray-200" style={{ borderRadius: 12, padding: 20, background: '#fff' }}>
                <div className="flex items-center" style={{ gap: 10, marginBottom: 10 }}>
                  <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 8, background: stat.bg, color: stat.color }}>
                    <stat.icon size={16} />
                  </div>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{stat.label}</span>
                </div>
                <div className="font-semibold text-gray-900" style={{ fontSize: 24 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* RESERVATIONS TAB */}
        {!loading && activeTab === TAB_RESERVATIONS && (
          <div>
            {bookings.length === 0 ? (
              <div className="bg-white border border-gray-200 text-center" style={{ borderRadius: 12, padding: '48px 20px' }}>
                <p style={{ fontSize: 14, color: '#6b7280' }}>No reservations yet</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        {['Room', 'User ID', 'Date', 'Status', 'Price', 'Actions'].map((h) => (
                          <th key={h} className="text-left font-semibold text-gray-700" style={{ padding: '12px 16px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>{b.roomName}</td>
                          <td style={{ padding: '12px 16px', color: '#6b7280' }}>{b.userId}</td>
                          <td style={{ padding: '12px 16px', color: '#6b7280' }}>{formatTimestamp(b.startTime)}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span className="font-medium" style={{
                              fontSize: 11,
                              padding: '3px 10px',
                              borderRadius: 20,
                              background: b.status === 'CONFIRMED' ? '#f0fdf4' : b.status === 'PENDING' ? '#fffbeb' : b.status === 'CANCELLED' ? '#fef2f2' : '#f3f4f6',
                              color: b.status === 'CONFIRMED' ? '#059669' : b.status === 'PENDING' ? '#d97706' : b.status === 'CANCELLED' ? '#dc2626' : '#374151',
                            }}>
                              {b.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 500 }}>₱{b.totalPrice.toFixed(2)}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <div className="flex items-center" style={{ gap: 6 }}>
                              {b.status === 'PENDING' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                                  className="border-none cursor-pointer font-medium"
                                  style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: '#f0fdf4', color: '#059669' }}
                                >Confirm</button>
                              )}
                              {b.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleCancelBooking(b.id)}
                                  className="border-none cursor-pointer"
                                  style={{ padding: 4, borderRadius: 6, background: '#fef2f2', color: '#dc2626' }}
                                ><Trash2 size={14} /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ROOMS TAB */}
        {!loading && activeTab === TAB_ROOMS && (
          <div>
            <div className="flex items-center" style={{ marginBottom: 16 }}>
              <button
                onClick={openAddRoom}
                className="flex items-center font-semibold border-none cursor-pointer text-white"
                style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, gap: 6, background: '#2563eb' }}
              >
                <Plus size={14} /> Add Room
              </button>
            </div>
            {rooms.length === 0 ? (
              <div className="bg-white border border-gray-200 text-center" style={{ borderRadius: 12, padding: '48px 20px' }}>
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>No rooms found</p>
                <button onClick={openAddRoom} className="border-none cursor-pointer font-medium" style={{ fontSize: 13, color: '#2563eb', background: 'none' }}>
                  Add your first room
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        {['Name', 'Building', 'Type', 'Capacity', 'Price/hr', 'Actions'].map((h) => (
                          <th key={h} className="text-left font-semibold text-gray-700" style={{ padding: '12px 16px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>{r.name}</td>
                          <td style={{ padding: '12px 16px', color: '#6b7280' }}>{r.building}, Floor {r.floor}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span className="font-medium" style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#f3f4f6', color: '#374151' }}>{r.type}</span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#6b7280' }}>{r.capacity}</td>
                          <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 500 }}>₱{r.pricePerHour.toFixed(2)}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <div className="flex items-center" style={{ gap: 6 }}>
                              <button
                                onClick={() => openEditRoom(r)}
                                className="border-none cursor-pointer"
                                style={{ padding: 4, borderRadius: 6, background: '#eff6ff', color: '#2563eb' }}
                              ><Edit3 size={14} /></button>
                              <button
                                onClick={() => handleDeleteRoom(r.id)}
                                className="border-none cursor-pointer"
                                style={{ padding: 4, borderRadius: 6, background: '#fef2f2', color: '#dc2626' }}
                              ><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white border border-gray-200" style={{ borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', margin: 20 }}>
            <div className="flex items-center justify-between" style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <div className="font-semibold text-gray-900" style={{ fontSize: 16 }}>{editingRoom ? 'Edit Room' : 'Add Room'}</div>
              <button onClick={() => setShowRoomModal(false)} className="border-none cursor-pointer" style={{ padding: 4, borderRadius: 6, background: '#f3f4f6', color: '#6b7280' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveRoom} style={{ padding: '20px 24px' }}>
              <div className="flex flex-col" style={{ gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Room Name</label>
                  <input required value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Building</label>
                    <input required value={roomForm.building} onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Floor</label>
                    <input required type="number" value={roomForm.floor} onChange={(e) => setRoomForm({ ...roomForm, floor: parseInt(e.target.value) || 0 })} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                  </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Capacity</label>
                    <input required type="number" value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || 0 })} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Price/hour (₱)</label>
                    <input required type="number" step="0.01" value={roomForm.pricePerHour} onChange={(e) => setRoomForm({ ...roomForm, pricePerHour: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                  </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Type</label>
                    <select value={roomForm.type} onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}>
                      {roomTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Location</label>
                    <input required value={roomForm.location} onChange={(e) => setRoomForm({ ...roomForm, location: e.target.value })} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Description</label>
                  <textarea value={roomForm.description} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} rows={2} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none', resize: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Image URL</label>
                  <input value={roomForm.imageUrl} onChange={(e) => setRoomForm({ ...roomForm, imageUrl: e.target.value })} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 }}>Amenities (comma separated)</label>
                  <input value={roomForm.amenities?.join(', ') || ''} onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} className="w-full border border-gray-200" style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none' }} placeholder="Whiteboard, TV Display, HDMI Cable" />
                </div>
              </div>
              <div className="flex items-center" style={{ gap: 10, marginTop: 20 }}>
                <button type="submit" className="flex-1 font-semibold border-none cursor-pointer text-white" style={{ padding: 10, borderRadius: 10, fontSize: 13, background: '#0f172a' }}>
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
                <button type="button" onClick={() => setShowRoomModal(false)} className="font-medium border-none cursor-pointer" style={{ padding: '10px 16px', borderRadius: 10, fontSize: 13, background: '#f3f4f6', color: '#374151' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

