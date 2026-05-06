package edu.cit.quitayen.wildspace.features.rooms;

import edu.cit.quitayen.wildspace.features.rooms.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByAvailableTrue();
    List<Room> findByTypeAndAvailableTrue(String type);
    List<Room> findByBuildingAndAvailableTrue(String building);
}
