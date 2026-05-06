package edu.cit.quitayen.wildspace.features.rooms;

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

import edu.cit.quitayen.wildspace.features.rooms.dto.request.CreateRoomRequest;
import edu.cit.quitayen.wildspace.features.rooms.dto.response.RoomResponse;

@ExtendWith(MockitoExtension.class)
@DisplayName("Room Service Tests")
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomService roomService;

    private Room testRoom;

    @BeforeEach
    void setUp() {
        testRoom = new Room("Room101", "Building A", 1, 30, "CLASSROOM", "A101", 500);
        testRoom.setId("room1");
        testRoom.setAvailable(true);
        testRoom.setDescription("A spacious classroom");
        testRoom.setImageUrl("http://example.com/room1.jpg");
        testRoom.setAmenities(Arrays.asList("Whiteboard", "Projector", "AC"));
    }

    @Test
    @DisplayName("Should retrieve all available rooms")
    void testGetAllAvailableRooms() {
        // Given
        Room room2 = new Room("Room102", "Building A", 1, 25, "CLASSROOM", "A102", 500);
        room2.setId("room2");
        room2.setAvailable(true);

        when(roomRepository.findByAvailableTrue())
            .thenReturn(Arrays.asList(testRoom, room2));

        // When
        List<RoomResponse> rooms = roomService.getAvailableRooms();

        // Then
        assertEquals(2, rooms.size());
        assertEquals("Room101", rooms.get(0).getName());
        assertEquals("Room102", rooms.get(1).getName());
        verify(roomRepository, times(1)).findByAvailableTrue();
    }

    @Test
    @DisplayName("Should filter rooms by type")
    void testGetRoomsByType() {
        // Given
        when(roomRepository.findByTypeAndAvailableTrue("CLASSROOM"))
            .thenReturn(Arrays.asList(testRoom));

        // When
        List<RoomResponse> rooms = roomService.getRoomsByType("CLASSROOM");

        // Then
        assertEquals(1, rooms.size());
        assertEquals("CLASSROOM", rooms.get(0).getType());
        verify(roomRepository, times(1)).findByTypeAndAvailableTrue("CLASSROOM");
    }

    @Test
    @DisplayName("Should filter rooms by building")
    void testGetRoomsByBuilding() {
        // Given
        when(roomRepository.findByBuildingAndAvailableTrue("Building A"))
            .thenReturn(Arrays.asList(testRoom));

        // When
        List<RoomResponse> rooms = roomService.getRoomsByBuilding("Building A");

        // Then
        assertEquals(1, rooms.size());
        assertEquals("Building A", rooms.get(0).getBuilding());
    }

    @Test
    @DisplayName("Should retrieve room by ID")
    void testGetRoomById() {
        // Given
        when(roomRepository.findById("room1"))
            .thenReturn(Optional.of(testRoom));

        // When
        Optional<RoomResponse> room = roomService.getRoomById("room1");

        // Then
        assertTrue(room.isPresent());
        assertEquals("Room101", room.get().getName());
    }

    @Test
    @DisplayName("Should create room successfully")
    void testCreateRoomSuccess() {
        // Given
        CreateRoomRequest request = new CreateRoomRequest();
        request.setName("NewRoom");
        request.setBuilding("Building B");
        request.setFloor(2);
        request.setCapacity(40);
        request.setType("MEETING_ROOM");
        request.setLocation("B201");
        request.setPricePerHour(750);
        request.setDescription("Conference room");
        request.setImageUrl("http://example.com/newroom.jpg");
        request.setAmenities(Arrays.asList("TV", "WiFi"));

        Room newRoom = new Room(
            request.getName(),
            request.getBuilding(),
            request.getFloor(),
            request.getCapacity(),
            request.getType(),
            request.getLocation(),
            request.getPricePerHour()
        );
        newRoom.setId("room_new123");
        newRoom.setAvailable(true);
        newRoom.setDescription(request.getDescription());
        newRoom.setImageUrl(request.getImageUrl());
        newRoom.setAmenities(request.getAmenities());

        when(roomRepository.save(any(Room.class))).thenReturn(newRoom);

        // When
        RoomResponse response = roomService.createRoom(request);

        // Then
        assertNotNull(response);
        assertEquals("NewRoom", response.getName());
        assertEquals("room_new123", response.getId());
        assertEquals(750, response.getPricePerHour());
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    @DisplayName("Should update room successfully")
    void testUpdateRoomSuccess() {
        // Given
        CreateRoomRequest request = new CreateRoomRequest();
        request.setName("UpdatedRoom");
        request.setBuilding("Building A");
        request.setFloor(1);
        request.setCapacity(50);
        request.setType("CLASSROOM");
        request.setLocation("A101");
        request.setPricePerHour(600);

        when(roomRepository.findById("room1")).thenReturn(Optional.of(testRoom));
        
        Room updatedRoom = testRoom;
        updatedRoom.setName("UpdatedRoom");
        updatedRoom.setCapacity(50);
        updatedRoom.setPricePerHour(600);

        when(roomRepository.save(any(Room.class))).thenReturn(updatedRoom);

        // When
        RoomResponse response = roomService.updateRoom("room1", request);

        // Then
        assertNotNull(response);
        assertEquals("UpdatedRoom", response.getName());
        assertEquals(50, response.getCapacity());
        verify(roomRepository, times(1)).findById("room1");
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent room")
    void testUpdateRoomNotFound() {
        // Given
        CreateRoomRequest request = new CreateRoomRequest();
        when(roomRepository.findById("nonexistent")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> roomService.updateRoom("nonexistent", request)
        );
        assertEquals("Room not found", exception.getMessage());
    }

    @Test
    @DisplayName("Should delete room successfully")
    void testDeleteRoom() {
        // Given
        doNothing().when(roomRepository).deleteById("room1");

        // When
        roomService.deleteRoom("room1");

        // Then
        verify(roomRepository, times(1)).deleteById("room1");
    }
}
