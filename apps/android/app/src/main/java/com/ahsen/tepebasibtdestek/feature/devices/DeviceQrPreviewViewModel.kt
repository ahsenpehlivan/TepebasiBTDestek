package com.ahsen.tepebasibtdestek.feature.devices

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.ahsen.tepebasibtdestek.R
import com.ahsen.tepebasibtdestek.data.device.DeviceRepository
import com.ahsen.tepebasibtdestek.domain.auth.AuthRepository
import com.ahsen.tepebasibtdestek.domain.auth.SessionState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

private const val DEVICE_QR_ERROR_MESSAGE =
    "QR bilgisi yüklenemedi. Lütfen tekrar deneyin."
private const val DEVICE_QR_SESSION_ERROR_MESSAGE =
    "Oturum bilgisi doğrulanamadı. Lütfen yeniden giriş yapın."
private const val DEVICE_QR_INVALID_ID_MESSAGE =
    "Cihaz kimliği geçersiz görünüyor."
private const val DEVICE_QR_EMPTY_MESSAGE =
    "Bu cihaz için QR bilgisi bulunmuyor."
private const val DEVICE_QR_PAYLOAD_PREFIX = "TBT-DEVICE:"

class DeviceQrPreviewViewModel(
    private val deviceId: String,
    private val authRepository: AuthRepository,
    private val deviceRepository: DeviceRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(DeviceQrPreviewUiState())
    val uiState: StateFlow<DeviceQrPreviewUiState> = _uiState.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            if (deviceId.isBlank()) {
                _uiState.value = DeviceQrPreviewUiState(
                    isLoading = false,
                    errorMessage = DEVICE_QR_INVALID_ID_MESSAGE
                )
                return@launch
            }

            val authenticatedProfile =
                (authRepository.sessionState.value as? SessionState.Authenticated)?.profile
            if (authenticatedProfile == null) {
                _uiState.value = DeviceQrPreviewUiState(
                    isLoading = false,
                    errorMessage = DEVICE_QR_SESSION_ERROR_MESSAGE
                )
                return@launch
            }

            _uiState.value = DeviceQrPreviewUiState(isLoading = true)

            deviceRepository.loadDeviceDetail(deviceId)
                .onSuccess { detail ->
                    val qrToken = detail.qrToken?.trim().takeIf { !it.isNullOrEmpty() }
                    _uiState.value = DeviceQrPreviewUiState(
                        isLoading = false,
                        assetTag = detail.assetTag,
                        deviceTypeLabel = detail.type.labelResId()
                            .let { resId -> appLabelProvider(resId) },
                        qrPayload = qrToken?.let { DEVICE_QR_PAYLOAD_PREFIX + it },
                        emptyMessage = if (qrToken == null) DEVICE_QR_EMPTY_MESSAGE else null
                    )
                }
                .onFailure { error ->
                    _uiState.value = DeviceQrPreviewUiState(
                        isLoading = false,
                        errorMessage = error.message ?: DEVICE_QR_ERROR_MESSAGE
                    )
                }
        }
    }

    private fun appLabelProvider(resId: Int): String {
        return when (resId) {
            R.string.device_type_desktop -> "Masaüstü"
            R.string.device_type_laptop -> "Dizüstü"
            R.string.device_type_monitor -> "Monitör"
            R.string.device_type_printer -> "Yazıcı"
            R.string.device_type_scanner -> "Tarayıcı"
            R.string.device_type_network_device -> "Ağ Cihazı"
            R.string.device_type_tablet -> "Tablet"
            R.string.device_type_phone -> "Telefon"
            else -> "Diğer"
        }
    }

    companion object {
        fun factory(
            deviceId: String,
            authRepository: AuthRepository,
            deviceRepository: DeviceRepository
        ): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return DeviceQrPreviewViewModel(
                        deviceId = deviceId,
                        authRepository = authRepository,
                        deviceRepository = deviceRepository
                    ) as T
                }
            }
    }
}
