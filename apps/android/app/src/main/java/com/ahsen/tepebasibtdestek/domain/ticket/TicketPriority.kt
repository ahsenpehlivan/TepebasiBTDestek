package com.ahsen.tepebasibtdestek.domain.ticket

enum class TicketPriority(val rawValue: String) {
    Low("low"),
    Normal("normal"),
    High("high"),
    Urgent("urgent");

    companion object {
        fun fromRawValue(value: String): TicketPriority? =
            entries.firstOrNull { it.rawValue == value }
    }
}
