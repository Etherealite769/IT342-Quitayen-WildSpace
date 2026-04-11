import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Set default auth header if token exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const bookingAPI = {
  // Room endpoints
  getAllRooms: async () => {
    const response = await axios.get(`${API_BASE_URL}/rooms`);
    return response.data;
  },

  getAvailableRooms: async () => {
    const response = await axios.get(`${API_BASE_URL}/rooms/available`);
    return response.data;
  },

  getRoomsByType: async (type: string) => {
    const response = await axios.get(`${API_BASE_URL}/rooms/type/${type}`);
    return response.data;
  },

  getRoomById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/rooms/${id}`);
    return response.data;
  },

  // Booking endpoints
  createBooking: async (roomId: string, startTime: number, endTime: number, notes?: string) => {
    const response = await axios.post(`${API_BASE_URL}/bookings`, {
      roomId,
      startTime,
      endTime,
      notes,
    });
    return response.data;
  },

  getUserBookings: async () => {
    const response = await axios.get(`${API_BASE_URL}/bookings/user`);
    return response.data;
  },

  getRoomBookings: async (roomId: string) => {
    const response = await axios.get(`${API_BASE_URL}/bookings/room/${roomId}`);
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/bookings/${id}`);
    return response.data;
  },
};

export default bookingAPI;
