package com.ahsen.tepebasibtdestek

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.ahsen.tepebasibtdestek.navigation.AppNavHost
import com.ahsen.tepebasibtdestek.ui.theme.TepebasiBTDestekTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val appContainer = (application as TepebasiBtDestekApp).appContainer

        setContent {
            TepebasiBTDestekTheme {
                AppNavHost(appContainer = appContainer)
            }
        }
    }
}
