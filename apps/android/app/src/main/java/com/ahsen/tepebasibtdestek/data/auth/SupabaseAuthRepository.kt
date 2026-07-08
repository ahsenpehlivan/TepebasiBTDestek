package com.ahsen.tepebasibtdestek.data.auth

import com.ahsen.tepebasibtdestek.core.config.SupabaseConfig
import com.ahsen.tepebasibtdestek.core.result.AppResult
import com.ahsen.tepebasibtdestek.data.profile.ProfileDto
import com.ahsen.tepebasibtdestek.data.profile.toDomain
import com.ahsen.tepebasibtdestek.data.remote.supabase.SupabaseClientProvider
import com.ahsen.tepebasibtdestek.domain.auth.AuthRepository
import com.ahsen.tepebasibtdestek.domain.auth.AuthenticatedProfile
import com.ahsen.tepebasibtdestek.domain.auth.CurrentAuthUser
import com.ahsen.tepebasibtdestek.domain.auth.SessionState
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class SupabaseAuthRepository(
    private val clientProvider: SupabaseClientProvider
) : AuthRepository {
    private val _sessionState = MutableStateFlow<SessionState>(SessionState.Loading)

    override val sessionState: StateFlow<SessionState> = _sessionState.asStateFlow()

    override suspend fun restoreSession(): SessionState {
        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> {
                val state = SessionState.ConfigError(result.message)
                _sessionState.value = state
                return state
            }
        }

        client.auth.awaitInitialization()
        val currentSession = client.auth.currentSessionOrNull()
        if (currentSession == null) {
            val state = SessionState.Unauthenticated
            _sessionState.value = state
            return state
        }

        val state = resolveSessionState()
        _sessionState.value = state
        return state
    }

    override suspend fun signIn(email: String, password: String): AppResult<SessionState> {
        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> {
                val state = SessionState.ConfigError(result.message)
                _sessionState.value = state
                return AppResult.Success(state)
            }
        }

        return try {
            client.auth.signInWith(Email) {
                this.email = email.trim().lowercase()
                this.password = password
            }

            val state = resolveSessionState()
            _sessionState.value = state
            AppResult.Success(state)
        } catch (_: Exception) {
            AppResult.Failure(
                "E-posta veya parola hatali. Bilgilerinizi kontrol edip tekrar deneyin."
            )
        }
    }

    override suspend fun signOut(): AppResult<Unit> {
        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> {
                return AppResult.Failure(
                    "Oturum kapatilamadi. Uygulama yapilandirmasini kontrol edin."
                )
            }
        }

        return try {
            client.auth.signOut()
            _sessionState.value = SessionState.Unauthenticated
            AppResult.Success(Unit)
        } catch (_: Exception) {
            AppResult.Failure("Oturum kapatilamadi. Lutfen tekrar deneyin.")
        }
    }

    override suspend fun getCurrentUser(): CurrentAuthUser? {
        val client = (clientProvider.getClient() as? AppResult.Success)?.value ?: return null
        client.auth.awaitInitialization()
        val user = client.auth.currentSessionOrNull()?.user ?: return null

        return CurrentAuthUser(
            id = user.id,
            email = user.email
        )
    }

    override suspend fun hasCurrentSession(): Boolean {
        val client = (clientProvider.getClient() as? AppResult.Success)?.value ?: return false
        client.auth.awaitInitialization()
        return client.auth.currentSessionOrNull() != null
    }

    override suspend fun loadCurrentProfile(): AppResult<AuthenticatedProfile> {
        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> return AppResult.Failure(result.message)
        }

        client.auth.awaitInitialization()
        val currentUser = client.auth.currentSessionOrNull()?.user
            ?: return AppResult.Failure(
                "Aktif oturum bulunamadi. Lutfen yeniden giris yapin."
            )

        return try {
            val profiles = client.postgrest
                .from("profiles")
                .select(
                    columns = Columns.list(
                        "id",
                        "full_name",
                        "role",
                        "department_id",
                        "job_title",
                        "is_active"
                    )
                ) {
                    filter {
                        eq("id", currentUser.id)
                    }
                }
                .decodeList<ProfileDto>()

            val profile = profiles.firstOrNull()
                ?: return AppResult.Failure(
                    "Kullanici profili bulunamadi. Lutfen yonetici ile iletisime gecin."
                )

            val mappedProfile = profile.toDomain()
                ?: return AppResult.Failure(
                    "Rol bilgisi okunamadi. Lutfen sistem yoneticisi ile iletisime gecin."
                )

            AppResult.Success(mappedProfile)
        } catch (_: Exception) {
            AppResult.Failure(
                "Profil bilgisi okunamadi. Baglantinizi kontrol edip tekrar deneyin."
            )
        }
    }

    private suspend fun resolveSessionState(): SessionState {
        return when (val profileResult = loadCurrentProfile()) {
            is AppResult.Success -> {
                if (!profileResult.value.isActive) {
                    SessionState.AccessDenied(
                        message = "Bu profil pasif durumda oldugu icin mobil panele erisim verilmiyor.",
                        profile = profileResult.value
                    )
                } else {
                    SessionState.Authenticated(profileResult.value)
                }
            }

            is AppResult.Failure -> {
                if (profileResult.message == SupabaseConfig.MISSING_CONFIG_MESSAGE) {
                    SessionState.ConfigError(profileResult.message)
                } else {
                    SessionState.Error(profileResult.message)
                }
            }
        }
    }
}
