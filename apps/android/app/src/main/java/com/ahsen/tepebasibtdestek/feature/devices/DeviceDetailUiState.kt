package com.ahsen.tepebasibtdestek.feature.devices

import com.ahsen.tepebasibtdestek.domain.device.DeviceDetail

data class DeviceDetailUiState(
    val isLoading: Boolean = true,
    val detail: DeviceDetail? = null,
    val errorMessage: String? = null
)
