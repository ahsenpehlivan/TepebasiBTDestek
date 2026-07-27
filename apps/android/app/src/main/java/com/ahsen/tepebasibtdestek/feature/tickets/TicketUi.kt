package com.ahsen.tepebasibtdestek.feature.tickets

import androidx.annotation.StringRes
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
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
import com.ahsen.tepebasibtdestek.domain.ticket.TicketCategory
import com.ahsen.tepebasibtdestek.domain.ticket.TicketPriority
import com.ahsen.tepebasibtdestek.domain.ticket.TicketStatus
import com.ahsen.tepebasibtdestek.domain.ticket.TicketSummary
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

@StringRes
fun TicketStatus.labelResId(): Int = when (this) {
    TicketStatus.Open -> R.string.ticket_status_open
    TicketStatus.Assigned -> R.string.ticket_status_assigned
    TicketStatus.InProgress -> R.string.ticket_status_in_progress
    TicketStatus.WaitingUser -> R.string.ticket_status_waiting_user
    TicketStatus.Resolved -> R.string.ticket_status_resolved
    TicketStatus.Closed -> R.string.ticket_status_closed
    TicketStatus.Cancelled -> R.string.ticket_status_cancelled
}

@StringRes
fun TicketPriority.labelResId(): Int = when (this) {
    TicketPriority.Low -> R.string.ticket_priority_low
    TicketPriority.Normal -> R.string.ticket_priority_normal
    TicketPriority.High -> R.string.ticket_priority_high
    TicketPriority.Urgent -> R.string.ticket_priority_urgent
}

@StringRes
fun TicketCategory.labelResId(): Int = when (this) {
    TicketCategory.Hardware -> R.string.ticket_category_hardware
    TicketCategory.Software -> R.string.ticket_category_software
    TicketCategory.Network -> R.string.ticket_category_network
    TicketCategory.PrinterScanner -> R.string.ticket_category_printer_scanner
    TicketCategory.EmailAccount -> R.string.ticket_category_email_account
    TicketCategory.AccessRequest -> R.string.ticket_category_access_request
    TicketCategory.Other -> R.string.ticket_category_other
}

fun TicketStatus.containerColor(colorScheme: ColorScheme): Color = when (this) {
    TicketStatus.Open -> colorScheme.primaryContainer
    TicketStatus.Assigned -> colorScheme.secondaryContainer
    TicketStatus.InProgress -> colorScheme.tertiaryContainer
    TicketStatus.WaitingUser -> colorScheme.surfaceContainerHighest
    TicketStatus.Resolved -> Color(0xFFDDF3E4)
    TicketStatus.Closed -> colorScheme.surfaceContainerHigh
    TicketStatus.Cancelled -> Color(0xFFF9E0E0)
}

fun TicketStatus.contentColor(colorScheme: ColorScheme): Color = when (this) {
    TicketStatus.Open -> colorScheme.onPrimaryContainer
    TicketStatus.Assigned -> colorScheme.onSecondaryContainer
    TicketStatus.InProgress -> colorScheme.onTertiaryContainer
    TicketStatus.WaitingUser -> colorScheme.onSurfaceVariant
    TicketStatus.Resolved -> Color(0xFF245C35)
    TicketStatus.Closed -> colorScheme.onSurfaceVariant
    TicketStatus.Cancelled -> Color(0xFF8B2F2F)
}

fun TicketPriority.containerColor(colorScheme: ColorScheme): Color = when (this) {
    TicketPriority.Low -> colorScheme.surfaceContainerHigh
    TicketPriority.Normal -> colorScheme.secondaryContainer
    TicketPriority.High -> Color(0xFFFFE7CC)
    TicketPriority.Urgent -> Color(0xFFFBD6D6)
}

fun TicketPriority.contentColor(colorScheme: ColorScheme): Color = when (this) {
    TicketPriority.Low -> colorScheme.onSurfaceVariant
    TicketPriority.Normal -> colorScheme.onSecondaryContainer
    TicketPriority.High -> Color(0xFF8A4B00)
    TicketPriority.Urgent -> Color(0xFF8B2F2F)
}

fun formatTicketDate(value: String): String {
    return runCatching {
        val parsed = OffsetDateTime.parse(value)
        parsed.format(
            DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm", Locale.forLanguageTag("tr-TR"))
        )
    }.getOrElse { value }
}

@Composable
internal fun TicketSummaryCard(
    ticket: TicketSummary,
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
        androidx.compose.foundation.layout.Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = stringResource(R.string.ticket_number_label, ticket.ticketNumber),
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary
            )

            Text(
                text = ticket.title,
                style = MaterialTheme.typography.titleLarge,
                color = MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.SemiBold
            )

            Text(
                text = ticket.descriptionSummary,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TicketBadge(
                    text = stringResource(ticket.status.labelResId()),
                    containerColor = ticket.status.containerColor(MaterialTheme.colorScheme),
                    contentColor = ticket.status.contentColor(MaterialTheme.colorScheme)
                )
                TicketBadge(
                    text = stringResource(ticket.priority.labelResId()),
                    containerColor = ticket.priority.containerColor(MaterialTheme.colorScheme),
                    contentColor = ticket.priority.contentColor(MaterialTheme.colorScheme)
                )
            }

            DetailLine(
                label = stringResource(R.string.ticket_category_label),
                value = stringResource(ticket.category.labelResId())
            )
            DetailLine(
                label = stringResource(R.string.ticket_created_at_label),
                value = formatTicketDate(ticket.createdAt)
            )

            if (ticket.updatedAt != ticket.createdAt) {
                DetailLine(
                    label = stringResource(R.string.ticket_updated_at_label),
                    value = formatTicketDate(ticket.updatedAt)
                )
            }

            if (!ticket.deviceLabel.isNullOrBlank()) {
                DetailLine(
                    label = stringResource(R.string.ticket_device_label),
                    value = ticket.deviceLabel
                )
            }

            if (!ticket.assignedToName.isNullOrBlank()) {
                DetailLine(
                    label = stringResource(R.string.ticket_assigned_to_label),
                    value = ticket.assignedToName
                )
            }
        }
    }
}

@Composable
internal fun DetailLine(
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
internal fun TicketBadge(
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
