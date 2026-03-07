package edu.cit.quitayen.wildspace.repository;

import edu.cit.quitayen.wildspace.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    
    // For User Login
    Optional<User> findByEmail(String email);
    
    // For User Registration Validation
    Optional<User> findByStudentId(String studentId);
    Boolean existsByEmail(String email);
    Boolean existsByStudentId(String studentId);
}