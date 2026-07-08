package com.ahsen.tepebasibtdestek

import android.app.Application
import com.ahsen.tepebasibtdestek.core.AppContainer

class TepebasiBtDestekApp : Application() {
    lateinit var appContainer: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        appContainer = AppContainer()
    }
}
