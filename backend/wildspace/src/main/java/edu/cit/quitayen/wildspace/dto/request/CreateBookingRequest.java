package edu.cit.quitayen.wildspace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateBookingRequest {
    
    @NotBlank(message = "Room ID is required")
    private String roomId;
    
    @NotNull(message = "Start time is required")
    @Positive(message = "Start time must be positive")
    private Long startTime;
    
    @NotNull(message = "End time is required")
    @Positive(message = "End time must be positive")
    private Long endTime;
    
    private String notes;

    public CreateBookingRequest() {}

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
