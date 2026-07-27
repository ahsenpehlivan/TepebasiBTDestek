package com.ahsen.tepebasibtdestek.domain.ticket

data class TicketDetail(
    val id: String,
    val ticketNumber: String,
    val title: String,
    val description: String,
    val status: TicketStatus,
    val priority: TicketPriority,
    val category: TicketCategory,
    val createdAt: String,
    val updatedAt: String,
    val deviceLabel: String? = null,
    val assignedToId: String? = null,
    val assignedToName: String? = null,
    val comments: List<TicketComment> = emptyList()
)
