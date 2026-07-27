package com.ahsen.tepebasibtdestek.data.ticket

import com.ahsen.tepebasibtdestek.domain.ticket.CreateTicketInput
import com.ahsen.tepebasibtdestek.domain.ticket.TicketDetail
import com.ahsen.tepebasibtdestek.domain.ticket.TicketSummary

interface TicketRepository {
    suspend fun loadMyTickets(): Result<List<TicketSummary>>
    suspend fun loadTechnicianQueue(): Result<List<TicketSummary>>
    suspend fun loadTicketDetail(ticketId: String): Result<TicketDetail>
    suspend fun createTicket(input: CreateTicketInput): Result<String>
}
