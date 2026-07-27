package com.ahsen.tepebasibtdestek.data.device

import com.ahsen.tepebasibtdestek.domain.device.DeviceSummary

interface DeviceRepository {
    suspend fun loadDevices(): Result<List<DeviceSummary>>
}
