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

private const val MY_TICKETS_ERROR_MESSAGE =
    "Talepler yüklenemedi. Lütfen tekrar deneyin."
private const val MY_TICKETS_EMPLOYEE_ONLY_MESSAGE =
    "Bu ekran yalnızca personel talepleri için kullanılabilir."
private const val MY_TICKETS_SESSION_ERROR_MESSAGE =
    "Oturum bilgisi doğrulanamadı. Lütfen yeniden giriş yapın."

class MyTicketsViewModel(
    private val authRepository: AuthRepository,
    private val ticketRepository: TicketRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(MyTicketsUiState())
    val uiState: StateFlow<MyTicketsUiState> = _uiState.asStateFlow()

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
                _uiState.value = MyTicketsUiState(
                    isLoading = false,
                    errorMessage = MY_TICKETS_SESSION_ERROR_MESSAGE
                )
                return@launch
            }

            if (authenticatedProfile.role != AppRole.Employee) {
                _uiState.value = MyTicketsUiState(
                    isLoading = false,
                    errorMessage = MY_TICKETS_EMPLOYEE_ONLY_MESSAGE
                )
                return@launch
            }

            ticketRepository.loadMyTickets()
                .onSuccess { tickets ->
                    _uiState.value = MyTicketsUiState(
                        isLoading = false,
                        tickets = tickets
                    )
                }
                .onFailure { error ->
                    _uiState.value = MyTicketsUiState(
                        isLoading = false,
                        errorMessage = error.message ?: MY_TICKETS_ERROR_MESSAGE
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
                    return MyTicketsViewModel(authRepository, ticketRepository) as T
                }
            }
    }
}
