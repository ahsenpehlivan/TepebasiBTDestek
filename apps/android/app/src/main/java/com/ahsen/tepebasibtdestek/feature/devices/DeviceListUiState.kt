package com.ahsen.tepebasibtdestek.feature.devices

import com.ahsen.tepebasibtdestek.domain.device.DeviceSummary

data class DeviceListUiState(
    val isLoading: Boolean = true,
    val devices: List<DeviceSummary> = emptyList(),
    val errorMessage: String? = null
) {
    val isEmpty: Boolean
        get() = !isLoading && errorMessage == null && devices.isEmpty()
}
