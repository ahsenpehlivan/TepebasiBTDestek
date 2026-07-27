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

private const val DEVICE_LIST_ERROR_MESSAGE =
    "Cihazlar yüklenemedi. Lütfen tekrar deneyin."
private const val DEVICE_LIST_SESSION_ERROR_MESSAGE =
    "Oturum bilgisi doğrulanamadı. Lütfen yeniden giriş yapın."

class DeviceListViewModel(
    private val authRepository: AuthRepository,
    private val deviceRepository: DeviceRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(DeviceListUiState())
    val uiState: StateFlow<DeviceListUiState> = _uiState.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                errorMessage = null
            )

            val sessionState = authRepository.sessionState.value
            val authenticatedProfile = (sessionState as? SessionState.Authenticated)?.profile
            if (authenticatedProfile == null) {
                _uiState.value = DeviceListUiState(
                    isLoading = false,
                    errorMessage = DEVICE_LIST_SESSION_ERROR_MESSAGE
                )
                return@launch
            }

            deviceRepository.loadDevices()
                .onSuccess { devices ->
                    _uiState.value = DeviceListUiState(
                        isLoading = false,
                        devices = devices
                    )
                }
                .onFailure { error ->
                    _uiState.value = DeviceListUiState(
                        isLoading = false,
                        errorMessage = error.message ?: DEVICE_LIST_ERROR_MESSAGE
                    )
                }
        }
    }

    companion object {
        fun factory(
            authRepository: AuthRepository,
            deviceRepository: DeviceRepository
        ): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return DeviceListViewModel(authRepository, deviceRepository) as T
                }
            }
    }
}
