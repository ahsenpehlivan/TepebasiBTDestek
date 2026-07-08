package com.ahsen.tepebasibtdestek.feature.auth

import com.ahsen.tepebasibtdestek.domain.auth.SessionState

data class AuthUiState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val nextState: SessionState? = null
)
