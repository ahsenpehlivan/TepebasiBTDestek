package com.ahsen.tepebasibtdestek.domain.device

data class DeviceDetail(
    val id: String,
    val assetTag: String,
    val type: DeviceType,
    val brand: String?,
    val model: String?,
    val serialNumber: String?,
    val status: DeviceStatus,
    val departmentName: String?,
    val assignedUserName: String?,
    val purchaseDate: String?,
    val warrantyEndDate: String?,
    val notes: String?,
    val isActive: Boolean
)
