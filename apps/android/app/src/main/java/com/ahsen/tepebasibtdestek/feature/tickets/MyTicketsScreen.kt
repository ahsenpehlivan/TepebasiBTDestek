package com.ahsen.tepebasibtdestek.feature.tickets

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ahsen.tepebasibtdestek.R
import com.ahsen.tepebasibtdestek.core.ui.CenteredStatusCard
import com.ahsen.tepebasibtdestek.core.ui.ScreenScaffold
import com.ahsen.tepebasibtdestek.domain.ticket.TicketPriority
import com.ahsen.tepebasibtdestek.domain.ticket.TicketStatus
import com.ahsen.tepebasibtdestek.domain.ticket.TicketSummary

@Composable
fun MyTicketsScreen(
    state: MyTicketsUiState,
    onBackClick: () -> Unit,
    onRetryClick: () -> Unit,
    onTicketClick: (String) -> Unit,
    onCreateTicketClick: () -> Unit
) {
    when {
        state.isLoading -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.my_tickets_eyebrow),
                title = stringResource(R.string.my_tickets_title),
                description = stringResource(R.string.common_loading)
            )
        }

        !state.errorMessage.isNullOrBlank() -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.my_tickets_eyebrow),
                title = stringResource(R.string.my_tickets_title),
                description = state.errorMessage,
                action = {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Button(
                            onClick = onRetryClick,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(text = stringResource(R.string.common_retry))
                        }
                        OutlinedButton(
                            onClick = onBackClick,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(text = stringResource(R.string.common_back))
                        }
                    }
                }
            )
        }

        state.isEmpty -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.my_tickets_eyebrow),
                title = stringResource(R.string.my_tickets_title),
                description = stringResource(R.string.my_tickets_empty_message),
                action = {
                    OutlinedButton(
                        onClick = onBackClick,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(text = stringResource(R.string.common_back))
                    }
                }
            )
        }

        else -> {
            ScreenScaffold { contentPadding: PaddingValues ->
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(contentPadding),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    item {
                        Column(
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                text = stringResource(R.string.my_tickets_eyebrow),
                                style = MaterialTheme.typography.labelLarge,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = stringResource(R.string.my_tickets_title),
                                style = MaterialTheme.typography.headlineSmall,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = stringResource(R.string.my_tickets_description),
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Button(onClick = onCreateTicketClick) {
                                Text(text = stringResource(R.string.my_tickets_create_button))
                            }
                            OutlinedButton(onClick = onBackClick) {
                                Text(text = stringResource(R.string.common_back))
                            }
                        }
                    }

                    items(
                        items = state.tickets,
                        key = { ticket -> ticket.id }
                    ) { ticket ->
                        TicketSummaryCard(
                            ticket = ticket,
                            onClick = { onTicketClick(ticket.id) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun TicketSummaryCard(
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
        Column(
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
private fun DetailLine(
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
    containerColor: androidx.compose.ui.graphics.Color,
    contentColor: androidx.compose.ui.graphics.Color
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
