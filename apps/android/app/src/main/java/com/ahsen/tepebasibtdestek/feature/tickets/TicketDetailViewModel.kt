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

private const val TICKET_DETAIL_EMPLOYEE_ONLY_MESSAGE =
    "Bu ekran yalnızca personel talepleri için kullanılabilir."
private const val TICKET_DETAIL_SESSION_ERROR_MESSAGE =
    "Oturum bilgisi doğrulanamadı. Lütfen yeniden giriş yapın."
private const val TICKET_DETAIL_INVALID_ID_MESSAGE =
    "Talep kimliği geçersiz görünüyor."
private const val TICKET_DETAIL_ERROR_MESSAGE =
    "Talep detayı yüklenemedi. Lütfen tekrar deneyin."

class TicketDetailViewModel(
    private val ticketId: String,
    private val authRepository: AuthRepository,
    private val ticketRepository: TicketRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(TicketDetailUiState())
    val uiState: StateFlow<TicketDetailUiState> = _uiState.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        viewModelScope.launch {
            _uiState.value = TicketDetailUiState(isLoading = true)

            if (ticketId.isBlank()) {
                _uiState.value = TicketDetailUiState(
                    isLoading = false,
                    errorMessage = TICKET_DETAIL_INVALID_ID_MESSAGE
                )
                return@launch
            }

            val sessionState = authRepository.sessionState.value
            val authenticatedProfile = (sessionState as? SessionState.Authenticated)?.profile

            if (authenticatedProfile == null) {
                _uiState.value = TicketDetailUiState(
                    isLoading = false,
                    errorMessage = TICKET_DETAIL_SESSION_ERROR_MESSAGE
                )
                return@launch
            }

            if (authenticatedProfile.role != AppRole.Employee) {
                _uiState.value = TicketDetailUiState(
                    isLoading = false,
                    errorMessage = TICKET_DETAIL_EMPLOYEE_ONLY_MESSAGE
                )
                return@launch
            }

            ticketRepository.loadTicketDetail(ticketId)
                .onSuccess { ticketDetail ->
                    _uiState.value = TicketDetailUiState(
                        isLoading = false,
                        ticketDetail = ticketDetail
                    )
                }
                .onFailure { error ->
                    _uiState.value = TicketDetailUiState(
                        isLoading = false,
                        errorMessage = error.message ?: TICKET_DETAIL_ERROR_MESSAGE
                    )
                }
        }
    }

    companion object {
        fun factory(
            ticketId: String,
            authRepository: AuthRepository,
            ticketRepository: TicketRepository
        ): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return TicketDetailViewModel(
                        ticketId = ticketId,
                        authRepository = authRepository,
                        ticketRepository = ticketRepository
                    ) as T
                }
            }
    }
}
