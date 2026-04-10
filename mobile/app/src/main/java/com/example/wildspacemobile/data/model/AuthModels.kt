package com.example.wildspacemobile.data.model

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val studentId: String,
    val fullName: String,
    val email: String,
    val password: String
)

data class AuthResponse(
    val token: String?,
    val message: String?,
    val user: UserDto?
)

data class UserDto(
    val id: String,
    val name: String,
    val email: String
)
