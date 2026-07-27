package com.ahsen.tepebasibtdestek.feature.tickets

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.ahsen.tepebasibtdestek.data.ticket.TicketRepository
import com.ahsen.tepebasibtdestek.domain.auth.AppRole
import com.ahsen.tepebasibtdestek.domain.auth.AuthRepository
import com.ahsen.tepebasibtdestek.domain.auth.SessionState
import com.ahsen.tepebasibtdestek.domain.ticket.CreateTicketInput
import com.ahsen.tepebasibtdestek.domain.ticket.TicketCategory
import com.ahsen.tepebasibtdestek.domain.ticket.TicketPriority
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

private const val CREATE_TICKET_EMPLOYEE_ONLY_MESSAGE =
    "Bu ekran yalnızca personel talepleri için kullanılabilir."
private const val CREATE_TICKET_SESSION_ERROR_MESSAGE =
    "Oturum bilgisi doğrulanamadı. Lütfen yeniden giriş yapın."
private const val CREATE_TICKET_TITLE_EMPTY_MESSAGE =
    "Başlık boş olamaz."
private const val CREATE_TICKET_TITLE_SHORT_MESSAGE =
    "Talep başlığı çok kısa görünüyor."
private const val CREATE_TICKET_DESCRIPTION_EMPTY_MESSAGE =
    "Açıklama boş olamaz."
private const val CREATE_TICKET_CATEGORY_EMPTY_MESSAGE =
    "Kategori seçiniz."
private const val CREATE_TICKET_PRIORITY_EMPTY_MESSAGE =
    "Öncelik seçiniz."
private const val CREATE_TICKET_SUCCESS_MESSAGE =
    "Talebiniz oluşturuldu."
private const val CREATE_TICKET_ERROR_MESSAGE =
    "Talep oluşturulamadı. Lütfen tekrar deneyin."

class CreateTicketViewModel(
    private val authRepository: AuthRepository,
    private val ticketRepository: TicketRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(CreateTicketUiState())
    val uiState: StateFlow<CreateTicketUiState> = _uiState.asStateFlow()

    fun onTitleChanged(value: String) {
        _uiState.value = _uiState.value.copy(
            title = value,
            errorMessage = null,
            successMessage = null
        )
    }

    fun onDescriptionChanged(value: String) {
        _uiState.value = _uiState.value.copy(
            description = value,
            errorMessage = null,
            successMessage = null
        )
    }

    fun onCategorySelected(value: TicketCategory) {
        _uiState.value = _uiState.value.copy(
            selectedCategory = value,
            errorMessage = null
        )
    }

    fun onPrioritySelected(value: TicketPriority) {
        _uiState.value = _uiState.value.copy(
            selectedPriority = value,
            errorMessage = null
        )
    }

    fun submit() {
        val currentState = _uiState.value
        val title = currentState.title.trim()
        val description = currentState.description.trim()
        val category = currentState.selectedCategory
        val priority = currentState.selectedPriority

        val sessionState = authRepository.sessionState.value
        val authenticatedProfile = (sessionState as? SessionState.Authenticated)?.profile

        if (authenticatedProfile == null) {
            _uiState.value = currentState.copy(errorMessage = CREATE_TICKET_SESSION_ERROR_MESSAGE)
            return
        }

        if (authenticatedProfile.role != AppRole.Employee) {
            _uiState.value = currentState.copy(errorMessage = CREATE_TICKET_EMPLOYEE_ONLY_MESSAGE)
            return
        }

        if (title.isBlank()) {
            _uiState.value = currentState.copy(errorMessage = CREATE_TICKET_TITLE_EMPTY_MESSAGE)
            return
        }

        if (title.length < 5) {
            _uiState.value = currentState.copy(errorMessage = CREATE_TICKET_TITLE_SHORT_MESSAGE)
            return
        }

        if (description.isBlank()) {
            _uiState.value = currentState.copy(errorMessage = CREATE_TICKET_DESCRIPTION_EMPTY_MESSAGE)
            return
        }

        if (category == null) {
            _uiState.value = currentState.copy(errorMessage = CREATE_TICKET_CATEGORY_EMPTY_MESSAGE)
            return
        }

        if (priority == null) {
            _uiState.value = currentState.copy(errorMessage = CREATE_TICKET_PRIORITY_EMPTY_MESSAGE)
            return
        }

        viewModelScope.launch {
            _uiState.value = currentState.copy(
                isSaving = true,
                errorMessage = null,
                successMessage = null,
                createdTicketId = null,
                navigateToMyTickets = false,
                title = title,
                description = description
            )

            ticketRepository.createTicket(
                CreateTicketInput(
                    title = title,
                    description = description,
                    category = category,
                    priority = priority,
                    deviceId = null
                )
            ).onSuccess { createdTicketId ->
                _uiState.value = _uiState.value.copy(
                    isSaving = false,
                    successMessage = CREATE_TICKET_SUCCESS_MESSAGE,
                    createdTicketId = createdTicketId.takeIf { it.isNotBlank() },
                    navigateToMyTickets = createdTicketId.isBlank()
                )
            }.onFailure { error ->
                _uiState.value = _uiState.value.copy(
                    isSaving = false,
                    errorMessage = error.message ?: CREATE_TICKET_ERROR_MESSAGE
                )
            }
        }
    }

    fun consumeNavigation() {
        _uiState.value = _uiState.value.copy(
            createdTicketId = null,
            navigateToMyTickets = false,
            successMessage = null
        )
    }

    companion object {
        fun factory(
            authRepository: AuthRepository,
            ticketRepository: TicketRepository
        ): ViewModelProvider.Factory =
            object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return CreateTicketViewModel(authRepository, ticketRepository) as T
                }
            }
    }
}
