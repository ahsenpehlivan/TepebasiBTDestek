package com.ahsen.tepebasibtdestek.domain.ticket

data class TicketComment(
    val id: String,
    val ticketId: String,
    val authorName: String?,
    val body: String,
    val isInternal: Boolean,
    val createdAt: String
)
