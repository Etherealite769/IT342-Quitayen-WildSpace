package edu.cit.quitayen.wildspace.service;

import edu.cit.quitayen.wildspace.dto.request.CreateBookingRequest;
import edu.cit.quitayen.wildspace.dto.response.BookingResponse;
import edu.cit.quitayen.wildspace.model.Booking;
import edu.cit.quitayen.wildspace.model.Room;
import edu.cit.quitayen.wildspace.repository.BookingRepository;
import edu.cit.quitayen.wildspace.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    public BookingResponse createBooking(String userId, CreateBookingRequest request) {
        // Validate room exists
        Optional<Room> roomOpt = roomRepository.findById(request.getRoomId());
        if (roomOpt.isEmpty()) {
            throw new RuntimeException("Room not found");
        }

        Room room = roomOpt.get();

        // Validate time
        if (request.getStartTime() >= request.getEndTime()) {
            throw new RuntimeException("End time must be after start time");
        }

        // Check for overlapping bookings
        List<Booking> existingBookings = bookingRepository.findByRoomId(request.getRoomId());
        boolean hasConflict = existingBookings.stream()
            .filter(b -> !b.getStatus().equals("CANCELLED"))
            .anyMatch(b -> {
                long existingStart = b.getStartTime();
                long existingEnd = b.getEndTime();
                long newStart = request.getStartTime();
                long newEnd = request.getEndTime();
                return (newStart < existingEnd && newEnd > existingStart);
            });

        if (hasConflict) {
            throw new RuntimeException("Room is already booked for this time period");
        }

        // Calculate total price
        long durationHours = (request.getEndTime() - request.getStartTime()) / 3600000; // Convert ms to hours
        double totalPrice = durationHours * room.getPricePerHour();

        Booking booking = new Booking(
            userId,
            request.getRoomId(),
            room.getName(),
            request.getStartTime(),
            request.getEndTime(),
            totalPrice
        );
        booking.setNotes(request.getNotes());

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public List<BookingResponse> getUserBookings(String userId) {
        return bookingRepository.findByUserIdOrderByStartTimeDesc(userId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public List<BookingResponse> getRoomBookings(String roomId) {
        return bookingRepository.findByRoomId(roomId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public Optional<BookingResponse> getBookingById(String id) {
        return bookingRepository.findById(id)
            .map(this::mapToResponse);
    }

    public BookingResponse updateBookingStatus(String id, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        booking.setStatus(status);

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    public void cancelBooking(String id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        if (!booking.getStatus().equals("PENDING") && !booking.getStatus().equals("CONFIRMED")) {
            throw new RuntimeException("Cannot cancel a " + booking.getStatus() + " booking");
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
            booking.getId(),
            booking.getUserId(),
            booking.getRoomId(),
            booking.getRoomName(),
            booking.getStartTime(),
            booking.getEndTime(),
            booking.getStatus(),
            booking.getTotalPrice(),
            booking.getNotes(),
            booking.getCreatedAt()
        );
    }
}
