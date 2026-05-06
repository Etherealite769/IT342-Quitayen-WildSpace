package edu.cit.quitayen.wildspace.features.booking;

import edu.cit.quitayen.wildspace.features.booking.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByRoomId(String roomId);
    List<Booking> findByUserIdOrderByStartTimeDesc(String userId);
    List<Booking> findByStatus(String status);
}
