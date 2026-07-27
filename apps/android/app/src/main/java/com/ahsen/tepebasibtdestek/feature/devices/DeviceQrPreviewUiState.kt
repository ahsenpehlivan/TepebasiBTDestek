package com.ahsen.tepebasibtdestek.feature.devices

data class DeviceQrPreviewUiState(
    val isLoading: Boolean = true,
    val assetTag: String? = null,
    val deviceTypeLabel: String? = null,
    val qrPayload: String? = null,
    val errorMessage: String? = null,
    val emptyMessage: String? = null
)
