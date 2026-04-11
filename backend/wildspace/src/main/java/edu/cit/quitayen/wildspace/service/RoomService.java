package edu.cit.quitayen.wildspace.service;

import edu.cit.quitayen.wildspace.dto.request.CreateRoomRequest;
import edu.cit.quitayen.wildspace.dto.response.RoomResponse;
import edu.cit.quitayen.wildspace.model.Room;
import edu.cit.quitayen.wildspace.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public RoomResponse createRoom(CreateRoomRequest request) {
        Room room = new Room(
            request.getName(),
            request.getBuilding(),
            request.getFloor(),
            request.getCapacity(),
            request.getType(),
            request.getLocation(),
            request.getPricePerHour()
        );
        room.setDescription(request.getDescription());
        
        Room savedRoom = roomRepository.save(room);
        return mapToResponse(savedRoom);
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public List<RoomResponse> getAvailableRooms() {
        return roomRepository.findByAvailableTrue()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public List<RoomResponse> getRoomsByType(String type) {
        return roomRepository.findByTypeAndAvailableTrue(type)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public List<RoomResponse> getRoomsByBuilding(String building) {
        return roomRepository.findByBuildingAndAvailableTrue(building)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public Optional<RoomResponse> getRoomById(String id) {
        return roomRepository.findById(id)
            .map(this::mapToResponse);
    }

    public RoomResponse updateRoom(String id, CreateRoomRequest request) {
        Optional<Room> roomOpt = roomRepository.findById(id);
        
        if (roomOpt.isEmpty()) {
            throw new RuntimeException("Room not found");
        }

        Room room = roomOpt.get();
        room.setName(request.getName());
        room.setBuilding(request.getBuilding());
        room.setFloor(request.getFloor());
        room.setCapacity(request.getCapacity());
        room.setType(request.getType());
        room.setLocation(request.getLocation());
        room.setPricePerHour(request.getPricePerHour());
        room.setDescription(request.getDescription());

        Room updatedRoom = roomRepository.save(room);
        return mapToResponse(updatedRoom);
    }

    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }

    private RoomResponse mapToResponse(Room room) {
        return new RoomResponse(
            room.getId(),
            room.getName(),
            room.getBuilding(),
            room.getFloor(),
            room.getCapacity(),
            room.getType(),
            room.getLocation(),
            room.isAvailable(),
            room.getPricePerHour(),
            room.getDescription()
        );
    }
}
