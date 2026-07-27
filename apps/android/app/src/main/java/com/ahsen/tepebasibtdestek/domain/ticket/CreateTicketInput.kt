package com.ahsen.tepebasibtdestek.domain.ticket

data class CreateTicketInput(
    val title: String,
    val description: String,
    val category: TicketCategory,
    val priority: TicketPriority,
    val deviceId: String? = null
)
