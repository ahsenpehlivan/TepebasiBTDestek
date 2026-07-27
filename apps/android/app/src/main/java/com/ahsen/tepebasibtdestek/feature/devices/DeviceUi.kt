package com.ahsen.tepebasibtdestek.feature.devices

import androidx.compose.foundation.clickable
import androidx.annotation.StringRes
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ahsen.tepebasibtdestek.R
import com.ahsen.tepebasibtdestek.domain.device.DeviceStatus
import com.ahsen.tepebasibtdestek.domain.device.DeviceSummary
import com.ahsen.tepebasibtdestek.domain.device.DeviceType
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

@StringRes
fun DeviceType.labelResId(): Int = when (this) {
    DeviceType.Desktop -> R.string.device_type_desktop
    DeviceType.Laptop -> R.string.device_type_laptop
    DeviceType.Monitor -> R.string.device_type_monitor
    DeviceType.Printer -> R.string.device_type_printer
    DeviceType.Scanner -> R.string.device_type_scanner
    DeviceType.NetworkDevice -> R.string.device_type_network_device
    DeviceType.Tablet -> R.string.device_type_tablet
    DeviceType.Phone -> R.string.device_type_phone
    DeviceType.Other -> R.string.device_type_other
}

@StringRes
fun DeviceStatus.labelResId(): Int = when (this) {
    DeviceStatus.Active -> R.string.device_status_active
    DeviceStatus.InRepair -> R.string.device_status_in_repair
    DeviceStatus.Spare -> R.string.device_status_spare
    DeviceStatus.Retired -> R.string.device_status_retired
    DeviceStatus.Lost -> R.string.device_status_lost
}

fun DeviceStatus.containerColor(colorScheme: ColorScheme): Color = when (this) {
    DeviceStatus.Active -> colorScheme.primaryContainer
    DeviceStatus.InRepair -> Color(0xFFFFE7CC)
    DeviceStatus.Spare -> colorScheme.secondaryContainer
    DeviceStatus.Retired -> colorScheme.surfaceContainerHigh
    DeviceStatus.Lost -> Color(0xFFFBD6D6)
}

fun DeviceStatus.contentColor(colorScheme: ColorScheme): Color = when (this) {
    DeviceStatus.Active -> colorScheme.onPrimaryContainer
    DeviceStatus.InRepair -> Color(0xFF8A4B00)
    DeviceStatus.Spare -> colorScheme.onSecondaryContainer
    DeviceStatus.Retired -> colorScheme.onSurfaceVariant
    DeviceStatus.Lost -> Color(0xFF8B2F2F)
}

@Composable
internal fun DeviceSummaryCard(
    device: DeviceSummary,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = device.assetTag,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary
            )

            Text(
                text = stringResource(device.type.labelResId()),
                style = MaterialTheme.typography.titleLarge,
                color = MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.SemiBold
            )

            Text(
                text = listOfNotNull(
                    device.brand?.takeIf { it.isNotBlank() },
                    device.model?.takeIf { it.isNotBlank() }
                ).joinToString(" / ").ifBlank {
                    stringResource(R.string.device_brand_model_empty)
                },
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                DeviceBadge(
                    text = stringResource(device.status.labelResId()),
                    containerColor = device.status.containerColor(MaterialTheme.colorScheme),
                    contentColor = device.status.contentColor(MaterialTheme.colorScheme)
                )
                DeviceBadge(
                    text = stringResource(
                        if (device.isActive) {
                            R.string.device_active_badge
                        } else {
                            R.string.device_inactive_badge
                        }
                    ),
                    containerColor = MaterialTheme.colorScheme.surfaceContainerHigh,
                    contentColor = MaterialTheme.colorScheme.onSurface
                )
            }

            DeviceDetailLine(
                label = stringResource(R.string.device_asset_tag_label),
                value = device.assetTag
            )
            DeviceDetailLine(
                label = stringResource(R.string.device_type_label),
                value = stringResource(device.type.labelResId())
            )
            DeviceDetailLine(
                label = stringResource(R.string.device_brand_model_label),
                value = listOfNotNull(
                    device.brand?.takeIf { it.isNotBlank() },
                    device.model?.takeIf { it.isNotBlank() }
                ).joinToString(" / ").ifBlank {
                    stringResource(R.string.device_brand_model_empty)
                }
            )

            if (!device.departmentName.isNullOrBlank()) {
                DeviceDetailLine(
                    label = stringResource(R.string.device_department_label),
                    value = device.departmentName
                )
            }

            if (!device.assignedUserName.isNullOrBlank()) {
                DeviceDetailLine(
                    label = stringResource(R.string.device_assigned_user_label),
                    value = device.assignedUserName
                )
            }
        }
    }
}

fun buildBrandModelLabel(
    brand: String?,
    model: String?
): String {
    return listOfNotNull(
        brand?.takeIf { it.isNotBlank() },
        model?.takeIf { it.isNotBlank() }
    ).joinToString(" / ").ifBlank {
        "Belirtilmedi"
    }
}

fun maskSerialNumber(serialNumber: String): String {
    if (serialNumber.startsWith("DEMO-")) {
        return serialNumber
    }

    if (serialNumber.length <= 6) {
        return serialNumber.take(2) + "***"
    }

    return serialNumber.take(3) + "***" + serialNumber.takeLast(3)
}

fun formatDeviceDateValue(value: String): String {
    return runCatching {
        val parsed = OffsetDateTime.parse(value)
        parsed.format(
            DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.forLanguageTag("tr-TR"))
        )
    }.getOrElse { value }
}

@Composable
internal fun DeviceDetailLine(
    label: String,
    value: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            fontWeight = FontWeight.Medium
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
internal fun DeviceBadge(
    text: String,
    containerColor: Color,
    contentColor: Color
) {
    Surface(
        shape = RoundedCornerShape(999.dp),
        color = containerColor,
        contentColor = contentColor
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.SemiBold
        )
    }
}
