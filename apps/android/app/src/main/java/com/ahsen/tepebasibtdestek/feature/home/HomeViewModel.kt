package com.ahsen.tepebasibtdestek.feature.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.ahsen.tepebasibtdestek.core.result.AppResult
import com.ahsen.tepebasibtdestek.domain.auth.AuthRepository
import com.ahsen.tepebasibtdestek.domain.auth.SessionState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class HomeViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            authRepository.sessionState.collect { sessionState ->
                val profile = when (sessionState) {
                    is SessionState.Authenticated -> sessionState.profile
                    is SessionState.AccessDenied -> sessionState.profile
                    else -> null
                }

                _uiState.value = _uiState.value.copy(profile = profile)
            }
        }
    }

    fun signOut() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLogoutLoading = true,
                logoutErrorMessage = null,
                logoutCompleted = false
            )

            when (val result = authRepository.signOut()) {
                is AppResult.Success -> {
                    _uiState.value = _uiState.value.copy(
                        isLogoutLoading = false,
                        logoutCompleted = true
                    )
                }

                is AppResult.Failure -> {
                    _uiState.value = _uiState.value.copy(
                        isLogoutLoading = false,
                        logoutErrorMessage = result.message
                    )
                }
            }
        }
    }

    fun consumeLogout() {
        _uiState.value = _uiState.value.copy(logoutCompleted = false)
    }

    companion object {
        fun factory(authRepository: AuthRepository): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return HomeViewModel(authRepository) as T
                }
            }
    }
}
