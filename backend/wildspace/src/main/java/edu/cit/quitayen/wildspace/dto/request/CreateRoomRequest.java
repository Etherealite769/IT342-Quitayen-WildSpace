package edu.cit.quitayen.wildspace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateRoomRequest {
    
    @NotBlank(message = "Room name is required")
    private String name;
    
    @NotBlank(message = "Building is required")
    private String building;
    
    @NotNull(message = "Floor is required")
    private Integer floor;
    
    @Positive(message = "Capacity must be positive")
    private int capacity;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @Positive(message = "Price per hour must be positive")
    private double pricePerHour;
    
    private String description;

    public CreateRoomRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(double pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
