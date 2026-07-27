package com.ahsen.tepebasibtdestek.domain.device

enum class DeviceType(val rawValue: String) {
    Desktop("desktop"),
    Laptop("laptop"),
    Monitor("monitor"),
    Printer("printer"),
    Scanner("scanner"),
    NetworkDevice("network_device"),
    Tablet("tablet"),
    Phone("phone"),
    Other("other");

    companion object {
        fun fromRawValue(value: String): DeviceType? =
            entries.firstOrNull { it.rawValue == value }
    }
}
