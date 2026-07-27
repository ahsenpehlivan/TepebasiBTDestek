package com.ahsen.tepebasibtdestek.data.device

import com.ahsen.tepebasibtdestek.domain.device.DeviceDetail
import com.ahsen.tepebasibtdestek.domain.device.DeviceMaintenanceRecord
import com.ahsen.tepebasibtdestek.domain.device.DeviceSummary

interface DeviceRepository {
    suspend fun loadDevices(): Result<List<DeviceSummary>>
    suspend fun loadDeviceDetail(deviceId: String): Result<DeviceDetail>
    suspend fun loadMaintenanceRecords(deviceId: String): Result<List<DeviceMaintenanceRecord>>
}
