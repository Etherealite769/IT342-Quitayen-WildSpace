package edu.cit.quitayen.wildspace.service;

import edu.cit.quitayen.wildspace.dto.request.LoginRequest;
import edu.cit.quitayen.wildspace.dto.request.SignUpRequest;
import edu.cit.quitayen.wildspace.dto.response.AuthResponse;
import edu.cit.quitayen.wildspace.model.User;
import edu.cit.quitayen.wildspace.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(user.getId());
        String fullName = user.getFirstName() + " " + user.getLastName();
        
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
            user.getId(),
            user.getEmail(),
            fullName,
            user.getStudentId()
        );

        return new AuthResponse(token, userDto);
    }

    public AuthResponse register(SignUpRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.findByStudentId(request.getStudentId()).isPresent()) {
            throw new RuntimeException("Student ID already exists");
        }

        // Extract first and last name from fullName
        String[] names = request.getFullName().split(" ", 2);
        String firstName = names[0];
        String lastName = names.length > 1 ? names[1] : "";

        // Create new user
        User user = new User(
            request.getStudentId(),
            request.getEmail(),
            firstName,
            lastName,
            passwordEncoder.encode(request.getPassword())
        );
        user.setRole("STUDENT");

        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(savedUser.getId());
        
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
            savedUser.getId(),
            savedUser.getEmail(),
            request.getFullName(),
            savedUser.getStudentId()
        );

        return new AuthResponse(token, userDto);
    }
}
