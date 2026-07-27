package com.ahsen.tepebasibtdestek.feature.tickets

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.res.stringResource
import com.ahsen.tepebasibtdestek.R
import com.ahsen.tepebasibtdestek.core.ui.CenteredStatusCard
import com.ahsen.tepebasibtdestek.core.ui.ScreenScaffold
import com.ahsen.tepebasibtdestek.domain.ticket.TicketComment
import com.ahsen.tepebasibtdestek.domain.ticket.TicketDetail

@Composable
fun TicketDetailScreen(
    state: TicketDetailUiState,
    onBackClick: () -> Unit,
    onRetryClick: () -> Unit
) {
    when {
        state.isLoading -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.ticket_detail_eyebrow),
                title = stringResource(R.string.ticket_detail_title),
                description = stringResource(R.string.common_loading)
            )
        }

        !state.errorMessage.isNullOrBlank() -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.ticket_detail_eyebrow),
                title = stringResource(R.string.ticket_detail_title),
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

        state.ticketDetail != null -> {
            TicketDetailContent(
                ticketDetail = state.ticketDetail,
                onBackClick = onBackClick
            )
        }
    }
}

@Composable
private fun TicketDetailContent(
    ticketDetail: TicketDetail,
    onBackClick: () -> Unit
) {
    ScreenScaffold { contentPadding: PaddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(contentPadding)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = stringResource(R.string.ticket_detail_eyebrow),
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = stringResource(R.string.ticket_detail_title),
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = stringResource(R.string.ticket_number_label, ticketDetail.ticketNumber),
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                OutlinedButton(onClick = onBackClick) {
                    Text(text = stringResource(R.string.common_back))
                }
            }

            TicketSectionCard(title = stringResource(R.string.ticket_detail_summary_section)) {
                Text(
                    text = ticketDetail.title,
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.SemiBold
                )
                TicketBadgeRow(ticketDetail = ticketDetail)
                DetailValueLine(
                    label = stringResource(R.string.ticket_category_label),
                    value = stringResource(ticketDetail.category.labelResId())
                )
            }

            TicketSectionCard(title = stringResource(R.string.ticket_detail_description_section)) {
                Text(
                    text = ticketDetail.description,
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            TicketSectionCard(title = stringResource(R.string.ticket_detail_device_section)) {
                Text(
                    text = ticketDetail.deviceLabel
                        ?: stringResource(R.string.ticket_detail_device_empty),
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            TicketSectionCard(title = stringResource(R.string.ticket_detail_dates_section)) {
                DetailValueLine(
                    label = stringResource(R.string.ticket_created_at_label),
                    value = formatTicketDate(ticketDetail.createdAt)
                )
                DetailValueLine(
                    label = stringResource(R.string.ticket_updated_at_label),
                    value = formatTicketDate(ticketDetail.updatedAt)
                )
            }

            TicketSectionCard(title = stringResource(R.string.ticket_detail_assignee_section)) {
                Text(
                    text = ticketDetail.assignedToName
                        ?: stringResource(R.string.ticket_detail_assignee_empty),
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            TicketSectionCard(title = stringResource(R.string.ticket_detail_comments_section)) {
                if (ticketDetail.comments.isEmpty()) {
                    Text(
                        text = stringResource(R.string.ticket_detail_comments_empty),
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        ticketDetail.comments.forEach { comment ->
                            CommentCard(comment = comment)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TicketBadgeRow(ticketDetail: TicketDetail) {
    androidx.compose.foundation.layout.FlowRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        TicketBadge(
            text = stringResource(ticketDetail.status.labelResId()),
            containerColor = ticketDetail.status.containerColor(MaterialTheme.colorScheme),
            contentColor = ticketDetail.status.contentColor(MaterialTheme.colorScheme)
        )
        TicketBadge(
            text = stringResource(ticketDetail.priority.labelResId()),
            containerColor = ticketDetail.priority.containerColor(MaterialTheme.colorScheme),
            contentColor = ticketDetail.priority.contentColor(MaterialTheme.colorScheme)
        )
    }
}

@Composable
private fun TicketSectionCard(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
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
            verticalArrangement = Arrangement.spacedBy(12.dp),
            content = {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.SemiBold
                )
                content()
            }
        )
    }
}

@Composable
private fun CommentCard(comment: TicketComment) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        color = MaterialTheme.colorScheme.surfaceContainerLowest
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            TicketBadge(
                text = stringResource(
                    if (comment.isInternal) {
                        R.string.ticket_comment_internal
                    } else {
                        R.string.ticket_comment_public
                    }
                ),
                containerColor = if (comment.isInternal) {
                    MaterialTheme.colorScheme.secondaryContainer
                } else {
                    MaterialTheme.colorScheme.primaryContainer
                },
                contentColor = if (comment.isInternal) {
                    MaterialTheme.colorScheme.onSecondaryContainer
                } else {
                    MaterialTheme.colorScheme.onPrimaryContainer
                }
            )
            if (!comment.authorName.isNullOrBlank()) {
                Text(
                    text = comment.authorName,
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
            Text(
                text = comment.content,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = formatTicketDate(comment.createdAt),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun DetailValueLine(
    label: String,
    value: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            fontWeight = FontWeight.Medium
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}
