package com.ahsen.tepebasibtdestek.feature.tickets

import com.ahsen.tepebasibtdestek.domain.auth.AppRole
import com.ahsen.tepebasibtdestek.domain.ticket.TicketDetail
import com.ahsen.tepebasibtdestek.domain.ticket.TicketStatus

data class TicketDetailUiState(
    val isLoading: Boolean = true,
    val ticketDetail: TicketDetail? = null,
    val errorMessage: String? = null,
    val viewerRole: AppRole? = null,
    val availableStatusActions: List<TicketStatus> = emptyList(),
    val isUpdatingStatus: Boolean = false,
    val statusSuccessMessage: String? = null,
    val statusErrorMessage: String? = null
) {
    val canManageStatus: Boolean
        get() = viewerRole == AppRole.Technician || viewerRole == AppRole.Admin
}
