package com.ahsen.tepebasibtdestek.domain.device

enum class DeviceStatus(val rawValue: String) {
    Active("active"),
    InRepair("in_repair"),
    Spare("spare"),
    Retired("retired"),
    Lost("lost");

    companion object {
        fun fromRawValue(value: String): DeviceStatus? =
            entries.firstOrNull { it.rawValue == value }
    }
}
