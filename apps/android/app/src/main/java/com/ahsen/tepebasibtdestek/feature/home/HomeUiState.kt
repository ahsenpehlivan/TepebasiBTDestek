package com.ahsen.tepebasibtdestek.feature.home

import com.ahsen.tepebasibtdestek.domain.auth.AuthenticatedProfile

data class HomeUiState(
    val profile: AuthenticatedProfile? = null,
    val isLogoutLoading: Boolean = false,
    val logoutErrorMessage: String? = null,
    val logoutCompleted: Boolean = false
)
