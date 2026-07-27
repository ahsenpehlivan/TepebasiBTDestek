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
    val statusErrorMessage: String? = null,
    val commentBody: String = "",
    val isInternalComment: Boolean = false,
    val isSubmittingComment: Boolean = false,
    val commentSuccessMessage: String? = null,
    val commentErrorMessage: String? = null
) {
    val canManageStatus: Boolean
        get() = viewerRole == AppRole.Technician || viewerRole == AppRole.Admin

    val canAddInternalComment: Boolean
        get() = viewerRole == AppRole.Technician || viewerRole == AppRole.Admin
}
