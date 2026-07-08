package com.ahsen.tepebasibtdestek.feature.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.ahsen.tepebasibtdestek.core.result.AppResult
import com.ahsen.tepebasibtdestek.domain.auth.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class LoginViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    fun onEmailChanged(value: String) {
        _uiState.value = _uiState.value.copy(
            email = value,
            errorMessage = null
        )
    }

    fun onPasswordChanged(value: String) {
        _uiState.value = _uiState.value.copy(
            password = value,
            errorMessage = null
        )
    }

    fun signIn() {
        val currentState = _uiState.value
        val normalizedEmail = currentState.email.trim()
        val password = currentState.password

        if (normalizedEmail.isBlank()) {
            _uiState.value = currentState.copy(
                errorMessage = "E-posta alani bos birakilamaz."
            )
            return
        }

        if (password.isBlank()) {
            _uiState.value = currentState.copy(
                errorMessage = "Parola alani bos birakilamaz."
            )
            return
        }

        viewModelScope.launch {
            _uiState.value = currentState.copy(
                isLoading = true,
                errorMessage = null,
                nextState = null,
                email = normalizedEmail
            )

            when (val result = authRepository.signIn(normalizedEmail, password)) {
                is AppResult.Failure -> {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        errorMessage = result.message
                    )
                }

                is AppResult.Success -> {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        nextState = result.value
                    )
                }
            }
        }
    }

    fun consumeNavigation() {
        _uiState.value = _uiState.value.copy(nextState = null)
    }

    companion object {
        fun factory(authRepository: AuthRepository): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return LoginViewModel(authRepository) as T
                }
            }
    }
}
