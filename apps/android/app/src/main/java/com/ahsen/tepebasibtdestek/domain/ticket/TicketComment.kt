package com.ahsen.tepebasibtdestek.domain.ticket

data class TicketComment(
    val id: String,
    val authorName: String?,
    val content: String,
    val isInternal: Boolean,
    val createdAt: String
)
