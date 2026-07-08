package com.ahsen.tepebasibtdestek.domain.auth

sealed interface SessionState {
    data object Loading : SessionState

    data object Unauthenticated : SessionState

    data class Authenticated(val profile: AuthenticatedProfile) : SessionState

    data class AccessDenied(
        val message: String,
        val profile: AuthenticatedProfile? = null
    ) : SessionState

    data class ConfigError(val message: String) : SessionState

    data class Error(val message: String) : SessionState
}
