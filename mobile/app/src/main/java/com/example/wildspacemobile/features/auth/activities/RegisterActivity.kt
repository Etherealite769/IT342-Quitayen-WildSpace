package com.example.wildspacemobile.ui.activities

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.wildspacemobile.data.api.RetrofitClient
import com.example.wildspacemobile.data.model.RegisterRequest
import com.example.wildspacemobile.databinding.ActivityRegisterBinding
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnRegister.setOnClickListener {
            handleRegister()
        }

        binding.tvLogin.setOnClickListener {
            finish()
        }
    }

    private fun handleRegister() {
        val studentId = binding.etStudentId.text.toString().trim()
        val fullName = binding.etFullName.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()
        val confirmPassword = binding.etConfirmPassword.text.toString().trim()

        if (studentId.isEmpty() || fullName.isEmpty() || email.isEmpty() || password.isEmpty()) {
            showError("Please fill in all fields")
            return
        }

        if (password != confirmPassword) {
            showError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            showError("Password must be at least 6 characters")
            return
        }

        if (!email.contains("@university.edu")) {
            showError("Please use your university email address")
            return
        }

        lifecycleScope.launch {
            binding.btnRegister.isEnabled = false
            binding.tvError.visibility = View.GONE

            try {
                val response = RetrofitClient.authService.register(
                    RegisterRequest(studentId, fullName, email, password)
                )
                if (response.isSuccessful) {
                    runOnUiThread {
                        Toast.makeText(this@RegisterActivity, "Registration Successful!", Toast.LENGTH_SHORT).show()
                        finish()
                    }
                } else {
                    runOnUiThread {
                        val errorMsg = when(response.code()) {
                            403 -> "Server error (403 Forbidden). Please check CORS/CSRF."
                            400 -> "Registration failed. Email might exist or data is invalid."
                            else -> "Registration failed (Error ${response.code()})"
                        }
                        showError(errorMsg)
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Connection error: ${e.message}")
                }
            } finally {
                runOnUiThread {
                    binding.btnRegister.isEnabled = true
                }
            }
        }
    }

    private fun showError(message: String) {
        binding.tvError.text = message
        binding.tvError.visibility = View.VISIBLE
    }
}
