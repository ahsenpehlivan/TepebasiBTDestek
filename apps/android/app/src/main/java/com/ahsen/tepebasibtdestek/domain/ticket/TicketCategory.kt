package com.ahsen.tepebasibtdestek.domain.ticket

enum class TicketCategory(val rawValue: String) {
    Hardware("hardware"),
    Software("software"),
    Network("network"),
    PrinterScanner("printer_scanner"),
    EmailAccount("email_account"),
    AccessRequest("access_request"),
    Other("other");

    companion object {
        fun fromRawValue(value: String): TicketCategory? =
            entries.firstOrNull { it.rawValue == value }
    }
}
