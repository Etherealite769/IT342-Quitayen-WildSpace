# WildSpace - Software Test Plan

**Project Name:** WildSpace (Room Booking and Management System)  
**Version:** 1.0  
**Date:** May 6, 2026  
**Prepared By:** IT342 Development Team

---

## Table of Contents
1. [Test Plan Overview](#test-plan-overview)
2. [Scope and Objectives](#scope-and-objectives)
3. [Test Strategy](#test-strategy)
4. [Functional Requirements Coverage](#functional-requirements-coverage)
5. [Test Cases](#test-cases)
6. [Test Scripts / Test Steps](#test-scripts--test-steps)
7. [Automated Test Cases](#automated-test-cases)
8. [Test Execution Plan](#test-execution-plan)
9. [Risk Assessment](#risk-assessment)

---

## Test Plan Overview

### Purpose
This document defines the comprehensive testing strategy for the WildSpace room booking and management system across all platforms (Backend, Web Frontend, Mobile Application).

### Scope
- **In Scope:**
  - Authentication module (Login, Registration)
  - Room Management module (View, Filter, Search)
  - Room Booking module (Create, View, Cancel)
  - User Dashboard
  - API endpoints and business logic
  - UI/UX functionality
  - Data validation and error handling
  - Mobile app functionality

- **Out of Scope:**
  - Third-party library testing (Spring Boot, React, Kotlin SDK)
  - Infrastructure/DevOps testing
  - Security penetration testing

### Testing Levels
1. **Unit Testing** - Individual components and methods
2. **Integration Testing** - API endpoints and service layer
3. **UI/E2E Testing** - User workflows and interactions
4. **Performance Testing** - Response times and load handling

---

## Scope and Objectives

### Objectives
1. Ensure all functional requirements are met
2. Validate data integrity and consistency
3. Verify error handling and edge cases
4. Confirm performance and stability
5. Ensure cross-platform compatibility

### Success Criteria
- All critical test cases pass (100%)
- All major test cases pass (90%+)
- No critical or high-severity bugs in production
- Test coverage > 80% for business logic

---

## Test Strategy

### Testing Approach
- **Behavior-Driven Development (BDD)** for acceptance testing
- **Test-Driven Development** for unit tests
- **Manual testing** for UI/UX validation
- **Automated testing** for regression and critical paths

### Test Environment
- **Backend:** Spring Boot with MongoDB on localhost:8080
- **Frontend:** React dev server on localhost:5173
- **Mobile:** Android Emulator or physical device
- **Database:** MongoDB local instance
- **Browsers:** Chrome, Firefox, Edge

### Test Data
- Test users with various roles and permissions
- Sample rooms with different characteristics
- Booking data for various scenarios

---

## Functional Requirements Coverage

### Requirement 1: User Authentication (AUTH-001)
**Description:** Users must be able to register and login securely

| Requirement ID | Feature | Test Coverage |
|---|---|---|
| AUTH-001.1 | User Registration | 100% |
| AUTH-001.2 | User Login | 100% |
| AUTH-001.3 | Password Validation | 100% |
| AUTH-001.4 | Email Validation | 100% |
| AUTH-001.5 | Session Management | 100% |
| AUTH-001.6 | JWT Token Generation | 100% |

### Requirement 2: Room Management (ROOM-001)
**Description:** System must allow viewing and managing room inventory

| Requirement ID | Feature | Test Coverage |
|---|---|---|
| ROOM-001.1 | View All Rooms | 100% |
| ROOM-001.2 | Filter by Type | 100% |
| ROOM-001.3 | Filter by Building | 100% |
| ROOM-001.4 | Search by Capacity | 100% |
| ROOM-001.5 | View Room Details | 100% |
| ROOM-001.6 | Check Availability | 100% |

### Requirement 3: Room Booking (BOOK-001)
**Description:** Users must be able to book available rooms

| Requirement ID | Feature | Test Coverage |
|---|---|---|
| BOOK-001.1 | Create Booking | 100% |
| BOOK-001.2 | View Bookings | 100% |
| BOOK-001.3 | Cancel Booking | 100% |
| BOOK-001.4 | Booking Validation | 100% |
| BOOK-001.5 | Conflict Detection | 100% |
| BOOK-001.6 | Cost Calculation | 100% |

### Requirement 4: User Dashboard (DASH-001)
**Description:** Users can view their reservations and account details

| Requirement ID | Feature | Test Coverage |
|---|---|---|
| DASH-001.1 | View User Profile | 100% |
| DASH-001.2 | View My Reservations | 100% |
| DASH-001.3 | Quick Stats | 100% |
| DASH-001.4 | Logout | 100% |

---

## Test Cases

### Authentication Test Cases

#### TC-AUTH-001: Successful User Registration
```
Test ID: TC-AUTH-001
Title: User can register with valid credentials
Priority: Critical
Pre-condition: User is on registration page
Steps:
  1. Enter valid Student ID (e.g., "STU123")
  2. Enter full name (e.g., "John Doe")
  3. Enter valid email (e.g., "john@cit.edu.ph")
  4. Enter password matching criteria (min 6 chars)
  5. Confirm password
  6. Click "Register" button
Expected Result: User account created, redirected to login, success message displayed
Post-condition: User can login with new credentials
Status: Active
```

#### TC-AUTH-002: Registration Validation - Duplicate Email
```
Test ID: TC-AUTH-002
Title: System rejects registration with existing email
Priority: High
Pre-condition: Email already exists in system
Steps:
  1. Navigate to registration page
  2. Fill form with existing email
  3. Complete other fields with valid data
  4. Click "Register" button
Expected Result: Error message displayed, registration fails
Actual Result: [To be filled during testing]
Status: Active
```

#### TC-AUTH-003: Login with Valid Credentials
```
Test ID: TC-AUTH-003
Title: User can login with valid credentials
Priority: Critical
Pre-condition: Valid user account exists
Steps:
  1. Navigate to login page
  2. Enter valid email
  3. Enter correct password
  4. Click "Login" button
Expected Result: User authenticated, redirected to dashboard, JWT token generated
Post-condition: User session is active
Status: Active
```

#### TC-AUTH-004: Login Failure - Invalid Password
```
Test ID: TC-AUTH-004
Title: System rejects login with incorrect password
Priority: High
Pre-condition: Valid user account exists
Steps:
  1. Navigate to login page
  2. Enter valid email
  3. Enter incorrect password
  4. Click "Login" button
Expected Result: Error message: "Invalid password"
Status: Active
```

#### TC-AUTH-005: Login Failure - Non-existent User
```
Test ID: TC-AUTH-005
Title: System rejects login with non-existent email
Priority: High
Pre-condition: None
Steps:
  1. Navigate to login page
  2. Enter non-existent email
  3. Enter password
  4. Click "Login" button
Expected Result: Error message: "User not found"
Status: Active
```

### Room Management Test Cases

#### TC-ROOM-001: View All Available Rooms
```
Test ID: TC-ROOM-001
Title: User can view all available rooms
Priority: Critical
Pre-condition: User is logged in, rooms exist in database
Steps:
  1. Navigate to "Rooms" page
  2. Wait for room list to load
Expected Result: List of all available rooms displayed with details
Actual Result: [To be filled during testing]
Status: Active
```

#### TC-ROOM-002: Filter Rooms by Type
```
Test ID: TC-ROOM-002
Title: User can filter rooms by type
Priority: High
Pre-condition: User is on Rooms page, multiple room types exist
Steps:
  1. Click on type filter dropdown
  2. Select "CLASSROOM"
  3. Observe results
Expected Result: Only classroom-type rooms are displayed
Status: Active
```

#### TC-ROOM-003: Filter Rooms by Building
```
Test ID: TC-ROOM-003
Title: User can filter rooms by building
Priority: High
Pre-condition: User is on Rooms page, rooms in multiple buildings exist
Steps:
  1. Click on building filter dropdown
  2. Select "Building A"
  3. Observe results
Expected Result: Only rooms in Building A are displayed
Status: Active
```

#### TC-ROOM-004: View Room Details
```
Test ID: TC-ROOM-004
Title: User can view detailed information of a room
Priority: High
Pre-condition: User is on Rooms page
Steps:
  1. Click on any room card
  2. Wait for details page to load
Expected Result: Room details page shows:
  - Room name, building, floor
  - Capacity and type
  - Price per hour
  - Amenities
  - Description with image
Status: Active
```

#### TC-ROOM-005: Combine Multiple Filters
```
Test ID: TC-ROOM-005
Title: User can apply multiple filters simultaneously
Priority: Medium
Pre-condition: User is on Rooms page
Steps:
  1. Filter by Type: "MEETING_ROOM"
  2. Filter by Building: "Building B"
  3. Observe results
Expected Result: Only meeting rooms in Building B are displayed
Status: Active
```

### Booking Test Cases

#### TC-BOOK-001: Create Valid Booking
```
Test ID: TC-BOOK-001
Title: User can create a valid room booking
Priority: Critical
Pre-condition: User logged in, room is available, booked room available
Steps:
  1. Navigate to room details
  2. Click "Book Now" button
  3. Enter required details:
     - Booking date
     - Start time
     - End time
     - Purpose (optional)
  4. Click "Confirm Booking"
Expected Result: 
  - Booking created successfully
  - Confirmation message displayed
  - Booking appears in "My Reservations"
Status: Active
```

#### TC-BOOK-002: Booking Conflict Detection
```
Test ID: TC-BOOK-002
Title: System detects and prevents double-booking
Priority: Critical
Pre-condition: 
  - Room has existing booking
  - User tries to book overlapping time
Steps:
  1. Select room with existing booking
  2. Attempt to book during existing booking time
  3. Click "Confirm Booking"
Expected Result: 
  - Error message: "Room not available for selected time"
  - Booking not created
Status: Active
```

#### TC-BOOK-003: Cancel Booking
```
Test ID: TC-BOOK-003
Title: User can cancel their booking
Priority: High
Pre-condition: User has active booking
Steps:
  1. Navigate to "Reservations"
  2. Find booking to cancel
  3. Click "Cancel Booking" button
  4. Confirm cancellation in dialog
Expected Result:
  - Booking canceled
  - Confirmation message displayed
  - Booking no longer appears in list
Status: Active
```

#### TC-BOOK-004: Calculate Booking Cost
```
Test ID: TC-BOOK-004
Title: System correctly calculates booking cost
Priority: Medium
Pre-condition: Room price per hour is defined
Steps:
  1. Select room (e.g., PHP 500/hour)
  2. Set booking duration (e.g., 2 hours)
  3. View booking preview
Expected Result: Total cost = PHP 500 × 2 = PHP 1,000
Status: Active
```

#### TC-BOOK-005: View Booking History
```
Test ID: TC-BOOK-005
Title: User can view all their bookings
Priority: High
Pre-condition: User has multiple bookings
Steps:
  1. Navigate to "Reservations" page
  2. Observe list
Expected Result: All user's bookings listed with:
  - Room name and location
  - Booking date and time
  - Status (confirmed, canceled, past)
  - Cancel button (if applicable)
Status: Active
```

### Dashboard Test Cases

#### TC-DASH-001: View Dashboard Statistics
```
Test ID: TC-DASH-001
Title: Dashboard displays correct statistics
Priority: High
Pre-condition: User logged in
Steps:
  1. Navigate to Dashboard
  2. Observe statistics panel
Expected Result: Dashboard shows:
  - Total bookings count
  - Upcoming reservations
  - Total spent (if available)
  - Quick action buttons
Status: Active
```

#### TC-DASH-002: View User Profile
```
Test ID: TC-DASH-002
Title: User can view their profile information
Priority: Medium
Pre-condition: User logged in
Steps:
  1. Click on user profile icon
  2. View profile details
Expected Result: Profile displays:
  - Full name
  - Student ID
  - Email
  - Role
Status: Active
```

#### TC-DASH-003: Logout
```
Test ID: TC-DASH-003
Title: User can logout successfully
Priority: High
Pre-condition: User logged in
Steps:
  1. Click on user menu
  2. Click "Logout" button
  3. Confirm logout
Expected Result:
  - JWT token cleared
  - Redirected to login page
  - Cannot access protected pages
Status: Active
```

---

## Test Scripts / Test Steps

### Test Script 1: Complete User Registration and First Login Flow

**Objective:** Verify end-to-end registration and authentication flow

**Pre-conditions:**
- Application is running
- Database is empty or test user doesn't exist
- Browser cache is cleared

**Test Steps:**

```
Step 1: Navigate to Application
  ACTION: Open browser and go to http://localhost:5173
  EXPECTED: Login page loads successfully

Step 2: Access Registration Page
  ACTION: Click "Register" or "Sign Up" link
  EXPECTED: Registration form displayed with fields:
    - Student ID
    - Full Name
    - Email
    - Password
    - Confirm Password

Step 3: Fill Registration Form
  ACTION: Enter following data:
    Student ID: TEST2026001
    Full Name: Test User
    Email: test@cit.edu.ph
    Password: SecurePass123
    Confirm: SecurePass123
  EXPECTED: All fields populated correctly

Step 4: Submit Registration
  ACTION: Click "Register" button
  EXPECTED: Success message displayed

Step 5: Verify Account Created
  ACTION: Check response and database
  EXPECTED: 
    - HTTP 201 Created response
    - User document in MongoDB
    - Fields match entered data
    - Password is hashed (not plain text)

Step 6: Login with New Account
  ACTION: Navigate to login
  ACTION: Enter email: test@cit.edu.ph
  ACTION: Enter password: SecurePass123
  ACTION: Click "Login"
  EXPECTED: 
    - Successful authentication
    - JWT token generated
    - Redirected to dashboard
    - User profile displayed

Step 7: Verify Session
  ACTION: Check localStorage/sessionStorage
  EXPECTED: JWT token stored

Step 8: Navigate Dashboard
  ACTION: Verify all dashboard elements load
  EXPECTED: Dashboard functional and fully loaded
```

### Test Script 2: Room Search and Booking Flow

**Objective:** Verify complete room browsing and booking process

**Pre-conditions:**
- User is logged in
- Sample rooms in database
- Room has available time slots

**Test Steps:**

```
Step 1: Navigate to Rooms Page
  ACTION: Click "Rooms" in navigation menu
  EXPECTED: Rooms page loads with list of available rooms

Step 2: Filter by Type
  ACTION: Select "CLASSROOM" from type filter
  EXPECTED: List updated to show only classrooms

Step 3: View Room Details
  ACTION: Click on first room in filtered list
  EXPECTED: Room detail page shows:
    - Large room image
    - All specifications (capacity, amenities)
    - Price per hour
    - "Book Now" button

Step 4: Initiate Booking
  ACTION: Click "Book Now" button
  EXPECTED: Booking form displayed with:
    - Calendar date picker
    - Time range selector
    - Purpose field (optional)

Step 5: Set Booking Details
  ACTION: 
    - Select date: (Today + 7 days)
    - Start time: 10:00 AM
    - End time: 12:00 PM
    - Purpose: "Project Meeting"
  EXPECTED: All fields filled correctly

Step 6: Preview Booking
  ACTION: Click "Review Booking" or similar
  EXPECTED: Summary shows:
    - Room name
    - Date and time
    - Duration: 2 hours
    - Cost: PHP 500 × 2 = PHP 1,000

Step 7: Confirm Booking
  ACTION: Click "Confirm Booking"
  EXPECTED:
    - Success notification displayed
    - Booking ID provided
    - Redirected to confirmation page

Step 8: Verify in Reservations
  ACTION: Navigate to "Reservations"
  EXPECTED: New booking visible in list with status "Confirmed"

Step 9: Cancel Booking
  ACTION: Click "Cancel" on the booking
  ACTION: Confirm cancellation in dialog
  EXPECTED:
    - Booking status changed to "Canceled"
    - Or removed from list
    - Confirmation message displayed
```

### Test Script 3: Data Validation and Error Handling

**Objective:** Verify system handles invalid data gracefully

**Pre-conditions:**
- Application running
- User not logged in

**Test Steps:**

```
Step 1: Test Email Validation
  ACTION: On registration form, enter "invalid-email"
  EXPECTED: Error: "Please enter a valid email address"

Step 2: Test Password Length
  ACTION: Enter password "123"
  EXPECTED: Error: "Password must be at least 6 characters"

Step 3: Test Duplicate Email Registration
  ACTION: Register with existing email
  EXPECTED: Error: "Email already registered"

Step 4: Test Duplicate Student ID
  ACTION: Register with existing Student ID
  EXPECTED: Error: "Student ID already exists"

Step 5: Test Empty Field Submission
  ACTION: Leave email field empty and submit
  EXPECTED: Error: "Email is required"

Step 6: Test Invalid Date Selection (Booking)
  ACTION: Try to book a past date
  EXPECTED: Error: "Cannot book in the past"

Step 7: Test Time Range Validation
  ACTION: Set end time before start time
  EXPECTED: Error: "End time must be after start time"
```

---

## Automated Test Cases

### Backend Unit Tests (JUnit 5 + Mockito)

#### 1. User Authentication Service Tests

```java
@SpringBootTest
@DisplayName("Authentication Service Tests")
class AuthServiceTests {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    
    @InjectMocks
    private AuthService authService;
    
    @Test
    @DisplayName("Should register new user successfully")
    void testRegisterUserSuccess() {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest(
            "STU001", "Test User", "test@cit.edu.ph", "password123"
        );
        when(userRepository.findByEmail("test@cit.edu.ph")).thenReturn(Optional.empty());
        when(userRepository.findByStudentId("STU001")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashed_password");
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("jwt_token");
        
        // When
        AuthResponse response = authService.register(signUpRequest);
        
        // Then
        assertNotNull(response);
        assertEquals("test@cit.edu.ph", response.getUser().getEmail());
        assertEquals("jwt_token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }
    
    @Test
    @DisplayName("Should reject registration with duplicate email")
    void testRegisterUserDuplicateEmail() {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest(
            "STU002", "Another User", "existing@cit.edu.ph", "password123"
        );
        when(userRepository.findByEmail("existing@cit.edu.ph"))
            .thenReturn(Optional.of(new User()));
        
        // When & Then
        assertThrows(RuntimeException.class, () -> authService.register(signUpRequest));
    }
    
    @Test
    @DisplayName("Should login successfully with valid credentials")
    void testLoginSuccess() {
        // Given
        User user = new User("STU003", "test@cit.edu.ph", "Test", "User", "hashed");
        user.setId("user123");
        LoginRequest loginRequest = new LoginRequest("test@cit.edu.ph", "password123");
        
        when(userRepository.findByEmail("test@cit.edu.ph")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed")).thenReturn(true);
        when(jwtTokenProvider.generateToken("user123")).thenReturn("jwt_token");
        
        // When
        AuthResponse response = authService.login(loginRequest);
        
        // Then
        assertNotNull(response);
        assertEquals("jwt_token", response.getToken());
        assertEquals("test@cit.edu.ph", response.getUser().getEmail());
    }
    
    @Test
    @DisplayName("Should reject login with invalid password")
    void testLoginInvalidPassword() {
        // Given
        User user = new User("STU004", "test@cit.edu.ph", "Test", "User", "hashed");
        LoginRequest loginRequest = new LoginRequest("test@cit.edu.ph", "wrongpassword");
        
        when(userRepository.findByEmail("test@cit.edu.ph")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "hashed")).thenReturn(false);
        
        // When & Then
        assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
    }
}
```

#### 2. Room Service Tests

```java
@SpringBootTest
@DisplayName("Room Service Tests")
class RoomServiceTests {
    
    @Mock
    private RoomRepository roomRepository;
    
    @InjectMocks
    private RoomService roomService;
    
    @Test
    @DisplayName("Should retrieve all available rooms")
    void testGetAllAvailableRooms() {
        // Given
        Room room1 = new Room("Room101", "Building A", 1, 30, "CLASSROOM", "A101", 500);
        Room room2 = new Room("Room102", "Building A", 1, 25, "CLASSROOM", "A102", 500);
        
        when(roomRepository.findByAvailableTrue())
            .thenReturn(List.of(room1, room2));
        
        // When
        List<RoomResponse> rooms = roomService.getAvailableRooms();
        
        // Then
        assertEquals(2, rooms.size());
        assertEquals("Room101", rooms.get(0).getName());
        assertEquals("Room102", rooms.get(1).getName());
    }
    
    @Test
    @DisplayName("Should filter rooms by type")
    void testGetRoomsByType() {
        // Given
        Room lab = new Room("Lab101", "Building B", 2, 20, "LAB", "B201", 750);
        when(roomRepository.findByTypeAndAvailableTrue("LAB"))
            .thenReturn(List.of(lab));
        
        // When
        List<RoomResponse> rooms = roomService.getRoomsByType("LAB");
        
        // Then
        assertEquals(1, rooms.size());
        assertEquals("LAB", rooms.get(0).getType());
    }
    
    @Test
    @DisplayName("Should create room successfully")
    void testCreateRoomSuccess() {
        // Given
        CreateRoomRequest request = new CreateRoomRequest();
        request.setName("NewRoom");
        request.setBuilding("Building C");
        request.setFloor(3);
        request.setCapacity(50);
        request.setType("AUDITORIUM");
        request.setLocation("C301");
        request.setPricePerHour(1000);
        
        Room savedRoom = new Room("NewRoom", "Building C", 3, 50, "AUDITORIUM", "C301", 1000);
        savedRoom.setId("room_new123");
        
        when(roomRepository.save(any(Room.class))).thenReturn(savedRoom);
        
        // When
        RoomResponse response = roomService.createRoom(request);
        
        // Then
        assertNotNull(response);
        assertEquals("NewRoom", response.getName());
        assertEquals("room_new123", response.getId());
    }
}
```

#### 3. Booking Service Tests

```java
@SpringBootTest
@DisplayName("Booking Service Tests")
class BookingServiceTests {
    
    @Mock
    private BookingRepository bookingRepository;
    
    @Mock
    private RoomRepository roomRepository;
    
    @InjectMocks
    private BookingService bookingService;
    
    @Test
    @DisplayName("Should create booking successfully")
    void testCreateBookingSuccess() {
        // Given
        CreateBookingRequest request = new CreateBookingRequest();
        request.setUserId("user123");
        request.setRoomId("room123");
        request.setStartTime(new Date());
        request.setEndTime(new Date(System.currentTimeMillis() + 3600000)); // +1 hour
        
        Booking booking = new Booking("user123", "room123", request.getStartTime(), 
                                     request.getEndTime(), "Meeting");
        booking.setId("booking123");
        booking.setStatus("CONFIRMED");
        
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);
        
        // When
        BookingResponse response = bookingService.createBooking(request);
        
        // Then
        assertNotNull(response);
        assertEquals("CONFIRMED", response.getStatus());
        assertEquals("booking123", response.getId());
    }
    
    @Test
    @DisplayName("Should reject double booking")
    void testDetectConflictingBooking() {
        // Given
        Date startTime = new Date();
        Date endTime = new Date(startTime.getTime() + 3600000);
        
        Booking existingBooking = new Booking("user456", "room123", startTime, endTime, "Meeting");
        
        when(bookingRepository.findConflictingBooking("room123", startTime, endTime))
            .thenReturn(List.of(existingBooking));
        
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            bookingService.validateBookingTime("room123", startTime, endTime);
        });
    }
}
```

### Frontend Integration Tests (Jest + React Testing Library)

```javascript
// tests/auth.test.tsx
describe('Authentication Module', () => {
    test('User can register with valid data', async () => {
        // Setup
        const { getByLabelText, getByRole } = render(<Register />);
        
        // Act
        fireEvent.change(getByLabelText(/student id/i), {
            target: { value: 'STU001' }
        });
        fireEvent.change(getByLabelText(/email/i), {
            target: { value: 'test@cit.edu.ph' }
        });
        fireEvent.change(getByLabelText(/password/i), {
            target: { value: 'password123' }
        });
        
        fireEvent.click(getByRole('button', { name: /register/i }));
        
        // Assert
        await waitFor(() => {
            expect(getByText(/registration successful/i)).toBeInTheDocument();
        });
    });
    
    test('Login form validates email format', async () => {
        const { getByLabelText, getByRole } = render(<Login />);
        
        fireEvent.change(getByLabelText(/email/i), {
            target: { value: 'invalid-email' }
        });
        fireEvent.click(getByRole('button', { name: /login/i }));
        
        await waitFor(() => {
            expect(getByText(/valid email/i)).toBeInTheDocument();
        });
    });
});

// tests/rooms.test.tsx
describe('Room Management Module', () => {
    test('Room list displays correctly', async () => {
        const mockRooms = [
            { id: '1', name: 'Room101', building: 'A', capacity: 30 },
            { id: '2', name: 'Room102', building: 'A', capacity: 25 }
        ];
        
        jest.spyOn(api, 'getRooms').mockResolvedValue(mockRooms);
        
        const { getAllByRole } = render(<Rooms />);
        
        await waitFor(() => {
            const rows = getAllByRole('button');
            expect(rows.length).toBe(2);
        });
    });
});

// tests/booking.test.tsx
describe('Booking Module', () => {
    test('Booking form calculates cost correctly', async () => {
        const { getByText, getByDisplayValue } = render(
            <BookingForm room={{ pricePerHour: 500 }} />
        );
        
        // Set 2 hour booking
        fireEvent.change(getByDisplayValue('10:00'), {
            target: { value: '12:00' }
        });
        
        await waitFor(() => {
            expect(getByText('Total: PHP 1,000')).toBeInTheDocument();
        });
    });
});
```

### API Integration Tests (REST Assured)

```java
// tests/AuthApiTests.java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthApiTests {
    
    @LocalServerPort
    private int port;
    
    @Test
    @DisplayName("POST /api/auth/register - Register new user")
    void testRegisterEndpoint() {
        given()
            .port(port)
            .contentType(ContentType.JSON)
            .body(new SignUpRequest("STU001", "Test User", "test@test.com", "pass123"))
        .when()
            .post("/api/auth/register")
        .then()
            .statusCode(201)
            .body("token", notNullValue())
            .body("user.email", equalTo("test@test.com"));
    }
    
    @Test
    @DisplayName("POST /api/auth/login - Login with valid credentials")
    void testLoginEndpoint() {
        given()
            .port(port)
            .contentType(ContentType.JSON)
            .body(new LoginRequest("test@test.com", "pass123"))
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(200)
            .body("token", notNullValue());
    }
}

// tests/RoomApiTests.java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RoomApiTests {
    
    @LocalServerPort
    private int port;
    
    @Test
    @DisplayName("GET /api/rooms - Get all available rooms")
    void testGetRoomsEndpoint() {
        given()
            .port(port)
            .header("Authorization", "Bearer " + getValidToken())
        .when()
            .get("/api/rooms")
        .then()
            .statusCode(200)
            .body("size()", greaterThan(0));
    }
    
    @Test
    @DisplayName("GET /api/rooms/type/{type} - Filter rooms by type")
    void testFilterByTypeEndpoint() {
        given()
            .port(port)
            .header("Authorization", "Bearer " + getValidToken())
        .when()
            .get("/api/rooms/type/CLASSROOM")
        .then()
            .statusCode(200)
            .body("type", everyItem(equalTo("CLASSROOM")));
    }
}

// tests/BookingApiTests.java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BookingApiTests {
    
    @LocalServerPort
    private int port;
    
    @Test
    @DisplayName("POST /api/bookings - Create booking")
    void testCreateBookingEndpoint() {
        given()
            .port(port)
            .contentType(ContentType.JSON)
            .header("Authorization", "Bearer " + getValidToken())
            .body(createValidBookingRequest())
        .when()
            .post("/api/bookings")
        .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("status", equalTo("CONFIRMED"));
    }
}
```

---

## Test Execution Plan

### Phase 1: Unit Testing (Week 1)
- **Scope:** Service layer, utilities, validators
- **Tools:** JUnit 5, Mockito
- **Target Coverage:** 85%+
- **Success Criteria:** All tests pass

### Phase 2: Integration Testing (Week 2)
- **Scope:** API endpoints, database operations
- **Tools:** REST Assured, TestContainers
- **Success Criteria:** All critical endpoints functional

### Phase 3: UI/E2E Testing (Week 2-3)
- **Scope:** User workflows, UI components
- **Tools:** Jest, React Testing Library, Selenium (if needed)
- **Success Criteria:** All user flows work end-to-end

### Phase 4: Performance Testing (Week 3)
- **Scope:** API response times, database queries
- **Tools:** JMeter, K6
- **Success Criteria:** 
  - API response < 500ms
  - Database queries < 100ms

### Phase 5: Mobile Testing (Week 3-4)
- **Scope:** Android app functionality
- **Tools:** Espresso, Android Instrumented Tests
- **Success Criteria:** All features work on target devices

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Database connection failures | Medium | High | Connection pooling, retry logic |
| JWT token expiration issues | Medium | Medium | Token refresh mechanism |
| Concurrent booking conflicts | High | High | Pessimistic locking, transactions |
| Mobile device compatibility | Medium | Medium | Test on multiple devices |
| API rate limiting | Low | Medium | Request throttling |
| Data validation bypass | Medium | High | Comprehensive input validation |

---

## Test Summary

**Total Test Cases:** 50+
- Unit Tests: 25+
- Integration Tests: 15+
- UI/E2E Tests: 10+

**Expected Timeline:** 3-4 weeks
**Target Coverage:** 80%+
**Success Criteria:** 95%+ test pass rate with zero critical bugs

---

**Document Version:** 1.0  
**Last Updated:** May 6, 2026  
**Next Review:** May 27, 2026
