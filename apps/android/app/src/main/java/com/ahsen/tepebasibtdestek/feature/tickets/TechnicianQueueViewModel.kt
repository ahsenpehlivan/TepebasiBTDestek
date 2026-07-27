package com.ahsen.tepebasibtdestek.feature.tickets

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.ahsen.tepebasibtdestek.data.ticket.TicketRepository
import com.ahsen.tepebasibtdestek.domain.auth.AppRole
import com.ahsen.tepebasibtdestek.domain.auth.AuthRepository
import com.ahsen.tepebasibtdestek.domain.auth.SessionState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

private const val TECHNICIAN_QUEUE_ERROR_MESSAGE =
    "İş kuyruğu yüklenemedi. Lütfen tekrar deneyin."
private const val TECHNICIAN_QUEUE_ROLE_MESSAGE =
    "Bu ekran yalnızca teknik personel iş kuyruğu için kullanılabilir."
private const val TECHNICIAN_QUEUE_SESSION_ERROR_MESSAGE =
    "Oturum bilgisi doğrulanamadı. Lütfen yeniden giriş yapın."

class TechnicianQueueViewModel(
    private val authRepository: AuthRepository,
    private val ticketRepository: TicketRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(TechnicianQueueUiState())
    val uiState: StateFlow<TechnicianQueueUiState> = _uiState.asStateFlow()

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
                _uiState.value = TechnicianQueueUiState(
                    isLoading = false,
                    errorMessage = TECHNICIAN_QUEUE_SESSION_ERROR_MESSAGE
                )
                return@launch
            }

            if (authenticatedProfile.role != AppRole.Technician) {
                _uiState.value = TechnicianQueueUiState(
                    isLoading = false,
                    errorMessage = TECHNICIAN_QUEUE_ROLE_MESSAGE
                )
                return@launch
            }

            ticketRepository.loadTechnicianQueue()
                .onSuccess { tickets ->
                    _uiState.value = TechnicianQueueUiState(
                        isLoading = false,
                        tickets = tickets
                    )
                }
                .onFailure { error ->
                    _uiState.value = TechnicianQueueUiState(
                        isLoading = false,
                        errorMessage = error.message ?: TECHNICIAN_QUEUE_ERROR_MESSAGE
                    )
                }
        }
    }

    companion object {
        fun factory(
            authRepository: AuthRepository,
            ticketRepository: TicketRepository
        ): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return TechnicianQueueViewModel(authRepository, ticketRepository) as T
                }
            }
    }
}
