package edu.cit.quitayen.wildspace.features.auth.dto.response;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public static class UserDto {
        private String id;
        private String email;
        private String fullName;
        private String studentId;
        private String role;

        public UserDto(String id, String email, String fullName, String studentId, String role) {
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.studentId = studentId;
            this.role = role;
        }

        public String getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getFullName() {
            return fullName;
        }

        public String getStudentId() {
            return studentId;
        }

        public String getRole() {
            return role;
        }
    }
}
