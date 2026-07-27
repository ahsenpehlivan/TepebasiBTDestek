package com.ahsen.tepebasibtdestek.domain.ticket

data class TicketSummary(
    val id: String,
    val ticketNumber: String,
    val title: String,
    val descriptionSummary: String,
    val status: TicketStatus,
    val priority: TicketPriority,
    val category: TicketCategory,
    val createdAt: String,
    val updatedAt: String,
    val deviceLabel: String? = null,
    val assignedToName: String? = null
)
