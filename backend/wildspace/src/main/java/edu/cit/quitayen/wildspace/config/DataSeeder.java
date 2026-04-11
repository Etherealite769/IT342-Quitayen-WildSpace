package edu.cit.quitayen.wildspace.config;

import edu.cit.quitayen.wildspace.model.Room;
import edu.cit.quitayen.wildspace.repository.RoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedRooms(RoomRepository roomRepository) {
        return args -> {
            // Check if rooms already exist
            if (roomRepository.count() > 0) {
                System.out.println("Rooms already seeded, skipping...");
                return;
            }

            List<Room> rooms = Arrays.asList(
                createRoom("Discussion Room A", "DR-101", "Library Building", 1, 8, "Discussion Room", 
                    "Library Building, Floor 1", 50.0, "A modern discussion room perfect for group study sessions and collaborative work.",
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
                    Arrays.asList("Whiteboard", "TV Display", "HDMI Cable")),
                
                createRoom("Lecture Hall B", "LH-203", "Academic Center", 2, 50, "Lecture Hall",
                    "Academic Center, Floor 2", 150.0, "Large lecture hall equipped with modern audio-visual equipment.",
                    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
                    Arrays.asList("Projector", "Sound System", "Microphone", "Air Conditioning")),
                
                createRoom("Science Laboratory 1", "LAB-305", "Science Building", 3, 20, "Laboratory",
                    "Science Building, Floor 3", 100.0, "Fully equipped science lab for chemistry and biology experiments.",
                    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
                    Arrays.asList("Lab Equipment", "Safety Cabinets", "Microscope", "Fume Hood")),
                
                createRoom("Computer Lab 1", "COM-201", "IT Building", 2, 30, "Computer Lab",
                    "IT Building, Floor 2", 75.0, "Computer lab with high-performance workstations and development tools.",
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
                    Arrays.asList("Computers", "Printers", "High-speed WiFi", "Development Tools")),
                
                createRoom("Study Room 1", "ST-101", "Library Building", 1, 4, "Study Room",
                    "Library Building, Floor 1", 30.0, "Quiet study room ideal for individual focus and reading.",
                    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
                    Arrays.asList("Quiet Space", "Reading Lights", "Power Outlets", "Desk Lamp")),
                
                createRoom("Conference Room A", "CR-301", "Admin Building", 3, 15, "Conference Room",
                    "Admin Building, Floor 3", 80.0, "Professional conference room for meetings and presentations.",
                    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
                    Arrays.asList("Video Conference", "Whiteboard", "Projector", "Coffee Machine"))
            );

            roomRepository.saveAll(rooms);
            System.out.println("✅ Successfully seeded " + rooms.size() + " rooms!");
        };
    }

    private Room createRoom(String name, String id, String building, int floor, int capacity, 
                           String type, String location, double price, String description, 
                           String imageUrl, List<String> amenities) {
        Room room = new Room();
        room.setId(id);
        room.setName(name);
        room.setBuilding(building);
        room.setFloor(floor);
        room.setCapacity(capacity);
        room.setType(type);
        room.setLocation(location);
        room.setPricePerHour(price);
        room.setDescription(description);
        room.setImageUrl(imageUrl);
        room.setAmenities(amenities);
        room.setAvailable(true);
        room.setCreatedAt(System.currentTimeMillis());
        return room;
    }
}
