package com.ahsen.tepebasibtdestek.feature.tickets

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.ahsen.tepebasibtdestek.data.ticket.TicketRepository
import com.ahsen.tepebasibtdestek.domain.auth.AppRole
import com.ahsen.tepebasibtdestek.domain.auth.AuthRepository
import com.ahsen.tepebasibtdestek.domain.auth.AuthenticatedProfile
import com.ahsen.tepebasibtdestek.domain.auth.SessionState
import com.ahsen.tepebasibtdestek.domain.ticket.TicketDetail
import com.ahsen.tepebasibtdestek.domain.ticket.TicketStatus
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

private const val TICKET_DETAIL_SESSION_ERROR_MESSAGE =
    "Oturum bilgisi doğrulanamadı. Lütfen yeniden giriş yapın."
private const val TICKET_DETAIL_INVALID_ID_MESSAGE =
    "Talep kimliği geçersiz görünüyor."
private const val TICKET_DETAIL_ERROR_MESSAGE =
    "Talep detayı yüklenemedi. Lütfen tekrar deneyin."
private const val TICKET_STATUS_UPDATE_SUCCESS_MESSAGE =
    "Talep durumu güncellendi."
private const val TICKET_STATUS_UPDATE_ERROR_MESSAGE =
    "Talep durumu güncellenemedi. Lütfen tekrar deneyin."
private const val TICKET_STATUS_UPDATE_ROLE_MESSAGE =
    "Bu işlem yalnızca teknik personel ve yönetici kullanıcılar için açıktır."

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
            loadDetail(clearStatusMessages = true)
        }
    }

    fun updateStatus(status: TicketStatus) {
        if (_uiState.value.isUpdatingStatus) {
            return
        }

        viewModelScope.launch {
            val profile = currentProfile()
            if (profile == null) {
                _uiState.value = _uiState.value.copy(
                    isUpdatingStatus = false,
                    statusErrorMessage = TICKET_STATUS_UPDATE_ROLE_MESSAGE
                )
                return@launch
            }

            if (!isTechnicalRole(profile.role)) {
                _uiState.value = _uiState.value.copy(
                    isUpdatingStatus = false,
                    statusErrorMessage = TICKET_STATUS_UPDATE_ROLE_MESSAGE
                )
                return@launch
            }

            val currentDetail = _uiState.value.ticketDetail
            if (currentDetail == null) {
                _uiState.value = _uiState.value.copy(
                    isUpdatingStatus = false,
                    statusErrorMessage = TICKET_STATUS_UPDATE_ERROR_MESSAGE
                )
                return@launch
            }

            _uiState.value = _uiState.value.copy(
                isUpdatingStatus = true,
                statusSuccessMessage = null,
                statusErrorMessage = null
            )

            ticketRepository.updateTicketStatus(ticketId = currentDetail.id, status = status)
                .onSuccess {
                    loadDetail(
                        clearStatusMessages = false,
                        successMessage = TICKET_STATUS_UPDATE_SUCCESS_MESSAGE
                    )
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(
                        isUpdatingStatus = false,
                        statusErrorMessage = error.message ?: TICKET_STATUS_UPDATE_ERROR_MESSAGE
                    )
                }
        }
    }

    private suspend fun loadDetail(
        clearStatusMessages: Boolean,
        successMessage: String? = null
    ) {
        if (ticketId.isBlank()) {
            _uiState.value = TicketDetailUiState(
                isLoading = false,
                errorMessage = TICKET_DETAIL_INVALID_ID_MESSAGE
            )
            return
        }

        val profile = currentProfile()
        if (profile == null) {
            _uiState.value = TicketDetailUiState(
                isLoading = false,
                errorMessage = TICKET_DETAIL_SESSION_ERROR_MESSAGE
            )
            return
        }

        val previousState = _uiState.value
        _uiState.value = previousState.copy(
            isLoading = true,
            errorMessage = null,
            viewerRole = profile.role,
            isUpdatingStatus = previousState.isUpdatingStatus && !clearStatusMessages,
            statusSuccessMessage = if (clearStatusMessages) null else successMessage ?: previousState.statusSuccessMessage,
            statusErrorMessage = if (clearStatusMessages) null else previousState.statusErrorMessage
        )

        ticketRepository.loadTicketDetail(ticketId)
            .onSuccess { ticketDetail ->
                _uiState.value = TicketDetailUiState(
                    isLoading = false,
                    ticketDetail = ticketDetail,
                    viewerRole = profile.role,
                    availableStatusActions = buildAvailableStatusActions(
                        ticketDetail = ticketDetail,
                        role = profile.role
                    ),
                    isUpdatingStatus = false,
                    statusSuccessMessage = if (clearStatusMessages) null else successMessage
                )
            }
            .onFailure { error ->
                _uiState.value = TicketDetailUiState(
                    isLoading = false,
                    errorMessage = error.message ?: TICKET_DETAIL_ERROR_MESSAGE,
                    viewerRole = profile.role,
                    isUpdatingStatus = false,
                    statusErrorMessage = if (clearStatusMessages) null else previousState.statusErrorMessage
                )
            }
    }

    private fun currentProfile(): AuthenticatedProfile? {
        val sessionState = authRepository.sessionState.value
        return (sessionState as? SessionState.Authenticated)?.profile
    }

    private fun buildAvailableStatusActions(
        ticketDetail: TicketDetail,
        role: AppRole
    ): List<TicketStatus> {
        if (!isTechnicalRole(role) || ticketDetail.assignedToId.isNullOrBlank()) {
            return emptyList()
        }

        return when (ticketDetail.status) {
            TicketStatus.Assigned -> listOf(
                TicketStatus.InProgress,
                TicketStatus.WaitingUser
            )

            TicketStatus.InProgress -> listOf(
                TicketStatus.WaitingUser,
                TicketStatus.Resolved
            )

            TicketStatus.WaitingUser -> listOf(
                TicketStatus.InProgress,
                TicketStatus.Resolved
            )

            TicketStatus.Resolved -> listOf(TicketStatus.InProgress)
            TicketStatus.Open,
            TicketStatus.Closed,
            TicketStatus.Cancelled -> emptyList()
        }
    }

    private fun isTechnicalRole(role: AppRole): Boolean {
        return role == AppRole.Technician || role == AppRole.Admin
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
