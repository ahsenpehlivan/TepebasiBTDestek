package com.ahsen.tepebasibtdestek.domain.ticket

enum class TicketStatus(val rawValue: String) {
    Open("open"),
    Assigned("assigned"),
    InProgress("in_progress"),
    WaitingUser("waiting_user"),
    Resolved("resolved"),
    Closed("closed"),
    Cancelled("cancelled");

    companion object {
        fun fromRawValue(value: String): TicketStatus? =
            entries.firstOrNull { it.rawValue == value }
    }
}
