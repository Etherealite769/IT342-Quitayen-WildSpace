package edu.cit.quitayen.wildspace.dto.response;

public class RoomResponse {
    private String id;
    private String name;
    private String building;
    private int floor;
    private int capacity;
    private String type;
    private String location;
    private boolean available;
    private double pricePerHour;
    private String description;

    public RoomResponse() {}

    public RoomResponse(String id, String name, String building, int floor, int capacity, 
                       String type, String location, boolean available, double pricePerHour, String description) {
        this.id = id;
        this.name = name;
        this.building = building;
        this.floor = floor;
        this.capacity = capacity;
        this.type = type;
        this.location = location;
        this.available = available;
        this.pricePerHour = pricePerHour;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
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

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
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
