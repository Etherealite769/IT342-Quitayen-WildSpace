package com.example.wildspacemobile.ui.activities

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.wildspacemobile.data.api.RetrofitClient
import com.example.wildspacemobile.data.model.LoginRequest
import com.example.wildspacemobile.databinding.ActivityLoginBinding
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Set default values matching web demo
        binding.etEmail.setText("student@university.edu")
        binding.etPassword.setText("student123")

        binding.btnSignIn.setOnClickListener {
            handleLogin()
        }

        binding.tvRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun handleLogin() {
        val email = binding.etEmail.text.toString().trim()
        val password = binding.etPassword.text.toString().trim()

        if (email.isEmpty() || password.isEmpty()) {
            showError("Please fill in all fields")
            return
        }

        lifecycleScope.launch {
            binding.btnSignIn.isEnabled = false
            binding.tvError.visibility = View.GONE
            
            try {
                val response = RetrofitClient.authService.login(LoginRequest(email, password))
                if (response.isSuccessful) {
                    runOnUiThread {
                        Toast.makeText(this@LoginActivity, "Welcome back!", Toast.LENGTH_SHORT).show()
                        val intent = Intent(this@LoginActivity, DashboardActivity::class.java)
                        intent.putExtra("USER_EMAIL", email)
                        startActivity(intent)
                        finish()
                    }
                } else {
                    runOnUiThread {
                        showError("Invalid email or password")
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Connection error")
                }
            } finally {
                runOnUiThread {
                    binding.btnSignIn.isEnabled = true
                }
            }
        }
    }

    private fun showError(message: String) {
        binding.tvError.text = message
        binding.tvError.visibility = View.VISIBLE
    }
}
