package com.ahsen.tepebasibtdestek.feature.devices

import com.ahsen.tepebasibtdestek.domain.device.DeviceDetail
import com.ahsen.tepebasibtdestek.domain.device.DeviceMaintenanceRecord

data class DeviceDetailUiState(
    val isLoading: Boolean = true,
    val detail: DeviceDetail? = null,
    val errorMessage: String? = null,
    val maintenanceLoading: Boolean = false,
    val maintenanceRecords: List<DeviceMaintenanceRecord> = emptyList(),
    val maintenanceErrorMessage: String? = null
)
