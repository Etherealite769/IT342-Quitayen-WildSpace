package com.example.wildspacemobile.ui.activities

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.wildspacemobile.R

class DashboardActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        val tvWelcomeBack = findViewById<TextView>(R.id.tvWelcomeBack)
        val tvUserInitial = findViewById<TextView>(R.id.tvUserInitial)
        val btnLogout = findViewById<Button>(R.id.btnLogout)
        val btnBrowseRooms = findViewById<Button>(R.id.btnBrowseRooms)
        val btnViewReservations = findViewById<Button>(R.id.btnViewReservations)

        // Get email or name from intent
        val name = intent.getStringExtra("USER_NAME") ?: "Demo Student"
        tvWelcomeBack.text = "Welcome back, $name!"
        tvUserInitial.text = name.take(1).uppercase()

        btnLogout.setOnClickListener {
            // Logout and go back to Login
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }
}
