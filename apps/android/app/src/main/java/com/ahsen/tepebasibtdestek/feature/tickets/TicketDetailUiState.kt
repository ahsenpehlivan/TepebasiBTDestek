package com.ahsen.tepebasibtdestek.feature.tickets

import com.ahsen.tepebasibtdestek.domain.ticket.TicketDetail

data class TicketDetailUiState(
    val isLoading: Boolean = true,
    val ticketDetail: TicketDetail? = null,
    val errorMessage: String? = null
)
