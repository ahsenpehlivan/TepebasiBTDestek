package com.ahsen.tepebasibtdestek.feature.tickets

import com.ahsen.tepebasibtdestek.domain.ticket.TicketCategory
import com.ahsen.tepebasibtdestek.domain.ticket.TicketPriority

data class CreateTicketUiState(
    val title: String = "",
    val description: String = "",
    val selectedCategory: TicketCategory? = null,
    val selectedPriority: TicketPriority? = null,
    val isSaving: Boolean = false,
    val errorMessage: String? = null,
    val successMessage: String? = null,
    val createdTicketId: String? = null,
    val navigateToMyTickets: Boolean = false
)
