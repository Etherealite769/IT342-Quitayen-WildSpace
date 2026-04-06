package com.example.wildspacemobile.data.api

import com.example.wildspacemobile.data.model.AuthResponse
import com.example.wildspacemobile.data.model.LoginRequest
import com.example.wildspacemobile.data.model.RegisterRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
}
