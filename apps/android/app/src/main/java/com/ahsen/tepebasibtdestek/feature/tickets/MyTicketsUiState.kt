package com.ahsen.tepebasibtdestek.feature.tickets

import com.ahsen.tepebasibtdestek.domain.ticket.TicketSummary

data class MyTicketsUiState(
    val isLoading: Boolean = true,
    val tickets: List<TicketSummary> = emptyList(),
    val errorMessage: String? = null
) {
    val isEmpty: Boolean
        get() = !isLoading && errorMessage == null && tickets.isEmpty()
}
