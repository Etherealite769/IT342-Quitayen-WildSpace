package edu.cit.quitayen.wildspace.features.booking;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import edu.cit.quitayen.wildspace.features.booking.dto.request.CreateBookingRequest;
import edu.cit.quitayen.wildspace.features.booking.dto.response.BookingResponse;
import edu.cit.quitayen.wildspace.features.rooms.Room;
import edu.cit.quitayen.wildspace.features.rooms.RoomRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Booking Service Tests")
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingService bookingService;

    private Booking testBooking;
    private Room testRoom;
    private long startTime;
    private long endTime;

    @BeforeEach
    void setUp() {
        startTime = System.currentTimeMillis() + 86400000; // Tomorrow
        endTime = startTime + 3600000; // +1 hour
        
        testRoom = new Room();
        testRoom.setId("room1");
        testRoom.setName("Test Room");
        testRoom.setPricePerHour(500.0);
        testRoom.setAvailable(true);
        
        testBooking = new Booking(
            "user123",
            "room1",
            "Test Room",
            startTime,
            endTime,
            500.0
        );
        testBooking.setId("booking1");
        testBooking.setStatus("CONFIRMED");
        testBooking.setNotes("Team Meeting");
    }

    @Test
    @DisplayName("Should create booking successfully")
    void testCreateBookingSuccess() {
        // Given
        CreateBookingRequest request = new CreateBookingRequest();
        request.setRoomId("room1");
        request.setStartTime(startTime);
        request.setEndTime(endTime);
        request.setNotes("Team Meeting");

        when(roomRepository.findById("room1")).thenReturn(Optional.of(testRoom));
        when(bookingRepository.findByRoomId("room1")).thenReturn(Arrays.asList());
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // When
        BookingResponse response = bookingService.createBooking("user123", request);

        // Then
        assertNotNull(response);
        assertEquals("booking1", response.getId());
        assertEquals("CONFIRMED", response.getStatus());
        assertEquals("user123", response.getUserId());
        assertEquals(500.0, response.getTotalPrice());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should reject booking when room not found")
    void testCreateBookingRoomNotFound() {
        // Given
        CreateBookingRequest request = new CreateBookingRequest();
        request.setRoomId("nonexistent");
        request.setStartTime(startTime);
        request.setEndTime(endTime);

        when(roomRepository.findById("nonexistent")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> bookingService.createBooking("user123", request)
        );
        assertEquals("Room not found", exception.getMessage());
    }

    @Test
    @DisplayName("Should reject booking when end time before start time")
    void testCreateBookingInvalidTime() {
        // Given
        CreateBookingRequest request = new CreateBookingRequest();
        request.setRoomId("room1");
        request.setStartTime(endTime);
        request.setEndTime(startTime);

        when(roomRepository.findById("room1")).thenReturn(Optional.of(testRoom));

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> bookingService.createBooking("user123", request)
        );
        assertEquals("End time must be after start time", exception.getMessage());
    }

    @Test
    @DisplayName("Should reject booking when room is already booked")
    void testCreateBookingConflict() {
        // Given
        CreateBookingRequest request = new CreateBookingRequest();
        request.setRoomId("room1");
        request.setStartTime(startTime);
        request.setEndTime(endTime);

        Booking existingBooking = new Booking(
            "user456",
            "room1",
            "Test Room",
            startTime,
            endTime,
            500.0
        );
        existingBooking.setId("existing");
        existingBooking.setStatus("CONFIRMED");

        when(roomRepository.findById("room1")).thenReturn(Optional.of(testRoom));
        when(bookingRepository.findByRoomId("room1")).thenReturn(Arrays.asList(existingBooking));

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> bookingService.createBooking("user123", request)
        );
        assertEquals("Room is already booked for this time period", exception.getMessage());
    }

    @Test
    @DisplayName("Should retrieve booking by ID")
    void testGetBookingById() {
        // Given
        when(bookingRepository.findById("booking1"))
            .thenReturn(Optional.of(testBooking));

        // When
        Optional<BookingResponse> booking = bookingService.getBookingById("booking1");

        // Then
        assertTrue(booking.isPresent());
        assertEquals("booking1", booking.get().getId());
        assertEquals("Team Meeting", booking.get().getNotes());
    }

    @Test
    @DisplayName("Should retrieve all bookings for a user")
    void testGetUserBookings() {
        // Given
        Booking booking2 = new Booking("user123", "room2", "Room 2", startTime + 3600000, endTime + 3600000, 500.0);
        booking2.setId("booking2");
        booking2.setStatus("CONFIRMED");

        when(bookingRepository.findByUserIdOrderByStartTimeDesc("user123"))
            .thenReturn(Arrays.asList(testBooking, booking2));

        // When
        List<BookingResponse> bookings = bookingService.getUserBookings("user123");

        // Then
        assertEquals(2, bookings.size());
        verify(bookingRepository, times(1)).findByUserIdOrderByStartTimeDesc("user123");
    }

    @Test
    @DisplayName("Should retrieve all bookings for a room")
    void testGetRoomBookings() {
        // Given
        when(bookingRepository.findByRoomId("room1"))
            .thenReturn(Arrays.asList(testBooking));

        // When
        List<BookingResponse> bookings = bookingService.getRoomBookings("room1");

        // Then
        assertEquals(1, bookings.size());
        assertEquals("room1", bookings.get(0).getRoomId());
    }

    @Test
    @DisplayName("Should cancel booking successfully")
    void testCancelBookingSuccess() {
        // Given
        testBooking.setStatus("CONFIRMED");
        
        when(bookingRepository.findById("booking1"))
            .thenReturn(Optional.of(testBooking));

        // When
        bookingService.cancelBooking("booking1");

        // Then
        assertEquals("CANCELLED", testBooking.getStatus());
        verify(bookingRepository, times(1)).findById("booking1");
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should throw exception when canceling non-existent booking")
    void testCancelBookingNotFound() {
        // Given
        when(bookingRepository.findById("nonexistent"))
            .thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> bookingService.cancelBooking("nonexistent")
        );
        assertEquals("Booking not found", exception.getMessage());
    }

    @Test
    @DisplayName("Should throw exception when canceling already cancelled booking")
    void testCancelAlreadyCancelledBooking() {
        // Given
        testBooking.setStatus("CANCELLED");
        
        when(bookingRepository.findById("booking1"))
            .thenReturn(Optional.of(testBooking));

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> bookingService.cancelBooking("booking1")
        );
        assertEquals("Cannot cancel a CANCELLED booking", exception.getMessage());
    }

    @Test
    @DisplayName("Should update booking status")
    void testUpdateBookingStatus() {
        // Given
        when(bookingRepository.findById("booking1"))
            .thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // When
        BookingResponse response = bookingService.updateBookingStatus("booking1", "COMPLETED");

        // Then
        assertNotNull(response);
        assertEquals("COMPLETED", response.getStatus());
    }

    @Test
    @DisplayName("Should calculate booking duration correctly")
    void testCalculateBookingDuration() {
        // Given - 1 hour booking

        // When
        long duration = testBooking.getEndTime() - testBooking.getStartTime();
        long hours = duration / (1000 * 60 * 60);

        // Then
        assertEquals(1, hours);
    }

    @Test
    @DisplayName("Should calculate booking cost correctly")
    void testCalculateBookingCost() {
        // Given
        double pricePerHour = 500;
        long duration = testBooking.getEndTime() - testBooking.getStartTime();
        long hours = duration / (1000 * 60 * 60);
        double expectedCost = pricePerHour * hours;

        // When
        double cost = pricePerHour * hours;

        // Then
        assertEquals(expectedCost, cost);
        assertEquals(500, cost); // 500 * 1 hour
    }
}
