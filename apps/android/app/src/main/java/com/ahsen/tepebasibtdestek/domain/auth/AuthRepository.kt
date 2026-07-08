package com.ahsen.tepebasibtdestek.domain.auth

import com.ahsen.tepebasibtdestek.core.result.AppResult
import kotlinx.coroutines.flow.StateFlow

interface AuthRepository {
    val sessionState: StateFlow<SessionState>

    suspend fun restoreSession(): SessionState

    suspend fun signIn(email: String, password: String): AppResult<SessionState>

    suspend fun signOut(): AppResult<Unit>

    suspend fun getCurrentUser(): CurrentAuthUser?

    suspend fun hasCurrentSession(): Boolean

    suspend fun loadCurrentProfile(): AppResult<AuthenticatedProfile>
}
