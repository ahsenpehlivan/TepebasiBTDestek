package com.ahsen.tepebasibtdestek.data.ticket

import com.ahsen.tepebasibtdestek.domain.ticket.CreateTicketInput
import com.ahsen.tepebasibtdestek.domain.ticket.TicketDetail
import com.ahsen.tepebasibtdestek.domain.ticket.TicketComment
import com.ahsen.tepebasibtdestek.domain.ticket.TicketStatus
import com.ahsen.tepebasibtdestek.domain.ticket.TicketSummary

interface TicketRepository {
    suspend fun loadMyTickets(): Result<List<TicketSummary>>
    suspend fun loadTechnicianQueue(): Result<List<TicketSummary>>
    suspend fun loadTicketDetail(ticketId: String): Result<TicketDetail>
    suspend fun loadTicketComments(ticketId: String): Result<List<TicketComment>>
    suspend fun addTicketComment(ticketId: String, body: String, isInternal: Boolean): Result<Unit>
    suspend fun updateTicketStatus(ticketId: String, status: TicketStatus): Result<Unit>
    suspend fun createTicket(input: CreateTicketInput): Result<String>
}
