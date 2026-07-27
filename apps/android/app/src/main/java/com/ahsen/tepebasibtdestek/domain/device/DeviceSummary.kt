package com.ahsen.tepebasibtdestek.domain.device

data class DeviceSummary(
    val id: String,
    val assetTag: String,
    val type: DeviceType,
    val brand: String?,
    val model: String?,
    val status: DeviceStatus,
    val departmentName: String?,
    val assignedUserName: String?,
    val isActive: Boolean
)
