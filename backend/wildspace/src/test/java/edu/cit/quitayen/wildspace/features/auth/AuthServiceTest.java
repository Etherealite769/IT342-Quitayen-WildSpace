package edu.cit.quitayen.wildspace.features.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import edu.cit.quitayen.wildspace.features.auth.dto.request.LoginRequest;
import edu.cit.quitayen.wildspace.features.auth.dto.request.SignUpRequest;
import edu.cit.quitayen.wildspace.features.auth.dto.response.AuthResponse;
import edu.cit.quitayen.wildspace.shared.security.JwtTokenProvider;

@ExtendWith(MockitoExtension.class)
@DisplayName("Authentication Service Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("user123");
        testUser.setStudentId("STU001");
        testUser.setEmail("test@cit.edu.ph");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPasswordHash("hashed_password");
        testUser.setRole("STUDENT");
    }

    @Test
    @DisplayName("Should register new user successfully")
    void testRegisterUserSuccess() {
        // Given
        SignUpRequest request = new SignUpRequest(
            "STU002",
            "New User",
            "newuser@cit.edu.ph",
            "password123"
        );

        when(userRepository.findByEmail("newuser@cit.edu.ph")).thenReturn(Optional.empty());
        when(userRepository.findByStudentId("STU002")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encrypted_password");
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("jwt_token_123");

        User savedUser = new User("STU002", "newuser@cit.edu.ph", "New", "User", "encrypted_password");
        savedUser.setId("new_user_id");
        savedUser.setRole("STUDENT");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        AuthResponse response = authService.register(request);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("newuser@cit.edu.ph", response.getUser().getEmail());
        assertEquals("jwt_token_123", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration with duplicate email")
    void testRegisterUserDuplicateEmail() {
        // Given
        SignUpRequest request = new SignUpRequest(
            "STU003",
            "Duplicate",
            "duplicate@cit.edu.ph",
            "password123"
        );

        when(userRepository.findByEmail("duplicate@cit.edu.ph"))
            .thenReturn(Optional.of(testUser));

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> authService.register(request)
        );
        assertEquals("Email already exists", exception.getMessage());
    }

    @Test
    @DisplayName("Should reject registration with duplicate student ID")
    void testRegisterUserDuplicateStudentId() {
        // Given
        SignUpRequest request = new SignUpRequest(
            "STU001",
            "Another User",
            "another@cit.edu.ph",
            "password123"
        );

        when(userRepository.findByEmail("another@cit.edu.ph")).thenReturn(Optional.empty());
        when(userRepository.findByStudentId("STU001")).thenReturn(Optional.of(testUser));

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> authService.register(request)
        );
        assertEquals("Student ID already exists", exception.getMessage());
    }

    @Test
    @DisplayName("Should login successfully with valid credentials")
    void testLoginSuccess() {
        // Given
        LoginRequest request = new LoginRequest(
            "test@cit.edu.ph",
            "password123"
        );

        when(userRepository.findByEmail("test@cit.edu.ph")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(jwtTokenProvider.generateToken("user123")).thenReturn("valid_jwt_token");

        // When
        AuthResponse response = authService.login(request);

        // Then
        assertNotNull(response);
        assertEquals("valid_jwt_token", response.getToken());
        assertEquals("test@cit.edu.ph", response.getUser().getEmail());
        verify(userRepository, times(1)).findByEmail("test@cit.edu.ph");
    }

    @Test
    @DisplayName("Should reject login with non-existent user")
    void testLoginUserNotFound() {
        // Given
        LoginRequest request = new LoginRequest(
            "nonexistent@cit.edu.ph",
            "password123"
        );

        when(userRepository.findByEmail("nonexistent@cit.edu.ph")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> authService.login(request)
        );
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    @DisplayName("Should reject login with invalid password")
    void testLoginInvalidPassword() {
        // Given
        LoginRequest request = new LoginRequest(
            "test@cit.edu.ph",
            "wrongpassword"
        );

        when(userRepository.findByEmail("test@cit.edu.ph")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "hashed_password")).thenReturn(false);

        // When & Then
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> authService.login(request)
        );
        assertEquals("Invalid password", exception.getMessage());
    }
}
