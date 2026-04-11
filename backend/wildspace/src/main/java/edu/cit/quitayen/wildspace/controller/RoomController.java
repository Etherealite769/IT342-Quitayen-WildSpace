package edu.cit.quitayen.wildspace.controller;

import edu.cit.quitayen.wildspace.dto.request.CreateRoomRequest;
import edu.cit.quitayen.wildspace.dto.response.RoomResponse;
import edu.cit.quitayen.wildspace.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        List<RoomResponse> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/available")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms() {
        List<RoomResponse> rooms = roomService.getAvailableRooms();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<RoomResponse>> getRoomsByType(@PathVariable String type) {
        List<RoomResponse> rooms = roomService.getRoomsByType(type);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/building/{building}")
    public ResponseEntity<List<RoomResponse>> getRoomsByBuilding(@PathVariable String building) {
        List<RoomResponse> rooms = roomService.getRoomsByBuilding(building);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable String id) {
        Optional<RoomResponse> room = roomService.getRoomById(id);
        return room.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        try {
            RoomResponse room = roomService.createRoom(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(room);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable String id, @Valid @RequestBody CreateRoomRequest request) {
        try {
            RoomResponse room = roomService.updateRoom(id, request);
            return ResponseEntity.ok(room);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
