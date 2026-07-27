package com.ahsen.tepebasibtdestek.domain.device

data class DeviceMaintenanceRecord(
    val id: String,
    val deviceId: String,
    val description: String,
    val performedAt: String? = null,
    val performedByName: String? = null,
    val cost: String? = null
)
