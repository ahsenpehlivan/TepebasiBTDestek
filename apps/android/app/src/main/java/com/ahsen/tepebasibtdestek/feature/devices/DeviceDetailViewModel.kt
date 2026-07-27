package com.ahsen.tepebasibtdestek.feature.devices

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.ahsen.tepebasibtdestek.data.device.DeviceRepository
import com.ahsen.tepebasibtdestek.domain.auth.AuthRepository
import com.ahsen.tepebasibtdestek.domain.auth.SessionState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

private const val DEVICE_DETAIL_ERROR_MESSAGE =
    "Cihaz bilgileri yüklenemedi. Lütfen tekrar deneyin."
private const val DEVICE_DETAIL_SESSION_ERROR_MESSAGE =
    "Oturum bilgisi doğrulanamadı. Lütfen yeniden giriş yapın."
private const val DEVICE_DETAIL_INVALID_ID_MESSAGE =
    "Cihaz kimliği geçersiz görünüyor."

class DeviceDetailViewModel(
    private val deviceId: String,
    private val authRepository: AuthRepository,
    private val deviceRepository: DeviceRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(DeviceDetailUiState())
    val uiState: StateFlow<DeviceDetailUiState> = _uiState.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            if (deviceId.isBlank()) {
                _uiState.value = DeviceDetailUiState(
                    isLoading = false,
                    errorMessage = DEVICE_DETAIL_INVALID_ID_MESSAGE
                )
                return@launch
            }

            val authenticatedProfile =
                (authRepository.sessionState.value as? SessionState.Authenticated)?.profile
            if (authenticatedProfile == null) {
                _uiState.value = DeviceDetailUiState(
                    isLoading = false,
                    errorMessage = DEVICE_DETAIL_SESSION_ERROR_MESSAGE
                )
                return@launch
            }

            _uiState.value = _uiState.value.copy(
                isLoading = true,
                errorMessage = null
            )

            deviceRepository.loadDeviceDetail(deviceId)
                .onSuccess { detail ->
                    _uiState.value = DeviceDetailUiState(
                        isLoading = false,
                        detail = detail
                    )
                }
                .onFailure { error ->
                    _uiState.value = DeviceDetailUiState(
                        isLoading = false,
                        errorMessage = error.message ?: DEVICE_DETAIL_ERROR_MESSAGE
                    )
                }
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
                    return DeviceDetailViewModel(
                        deviceId = deviceId,
                        authRepository = authRepository,
                        deviceRepository = deviceRepository
                    ) as T
                }
            }
    }
}
