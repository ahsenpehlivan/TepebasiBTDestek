package com.ahsen.tepebasibtdestek.feature.tickets

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.res.stringResource
import com.ahsen.tepebasibtdestek.R
import com.ahsen.tepebasibtdestek.core.ui.ScreenScaffold
import com.ahsen.tepebasibtdestek.domain.ticket.TicketCategory
import com.ahsen.tepebasibtdestek.domain.ticket.TicketPriority

@Composable
fun CreateTicketScreen(
    state: CreateTicketUiState,
    onTitleChanged: (String) -> Unit,
    onDescriptionChanged: (String) -> Unit,
    onCategorySelected: (TicketCategory) -> Unit,
    onPrioritySelected: (TicketPriority) -> Unit,
    onSaveClick: () -> Unit,
    onCancelClick: () -> Unit
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
                    text = stringResource(R.string.create_ticket_eyebrow),
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = stringResource(R.string.create_ticket_title),
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = stringResource(R.string.create_ticket_description),
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            TicketFormCard(title = stringResource(R.string.create_ticket_title_label)) {
                OutlinedTextField(
                    value = state.title,
                    onValueChange = onTitleChanged,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    label = { Text(stringResource(R.string.create_ticket_title_label)) }
                )
            }

            TicketFormCard(title = stringResource(R.string.create_ticket_body_label)) {
                OutlinedTextField(
                    value = state.description,
                    onValueChange = onDescriptionChanged,
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 4,
                    maxLines = 6,
                    label = { Text(stringResource(R.string.create_ticket_body_label)) }
                )
            }

            TicketFormCard(title = stringResource(R.string.create_ticket_category_label)) {
                SelectionGroup(
                    options = TicketCategory.entries,
                    selectedOption = state.selectedCategory,
                    optionLabel = { category -> stringResource(category.labelResId()) },
                    onOptionSelected = onCategorySelected
                )
            }

            TicketFormCard(title = stringResource(R.string.create_ticket_priority_label)) {
                SelectionGroup(
                    options = TicketPriority.entries,
                    selectedOption = state.selectedPriority,
                    optionLabel = { priority -> stringResource(priority.labelResId()) },
                    onOptionSelected = onPrioritySelected
                )
            }

            TicketFormCard(title = stringResource(R.string.create_ticket_device_label)) {
                Text(
                    text = stringResource(R.string.create_ticket_device_note),
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (!state.errorMessage.isNullOrBlank()) {
                Text(
                    text = state.errorMessage,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.error
                )
            }

            if (!state.successMessage.isNullOrBlank()) {
                Text(
                    text = state.successMessage,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Button(
                    onClick = onSaveClick,
                    modifier = Modifier.fillMaxWidth(),
                    enabled = !state.isSaving
                ) {
                    Text(
                        text = if (state.isSaving) {
                            stringResource(R.string.create_ticket_saving)
                        } else {
                            stringResource(R.string.create_ticket_save)
                        }
                    )
                }

                OutlinedButton(
                    onClick = onCancelClick,
                    modifier = Modifier.fillMaxWidth(),
                    enabled = !state.isSaving
                ) {
                    Text(text = stringResource(R.string.create_ticket_cancel))
                }
            }
        }
    }
}

@Composable
private fun TicketFormCard(
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
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.SemiBold
            )
            content()
        }
    }
}

@Composable
private fun <T> SelectionGroup(
    options: List<T>,
    selectedOption: T?,
    optionLabel: @Composable (T) -> String,
    onOptionSelected: (T) -> Unit
) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        options.forEach { option ->
            val isSelected = option == selectedOption
            if (isSelected) {
                Button(onClick = { onOptionSelected(option) }) {
                    Text(text = optionLabel(option))
                }
            } else {
                OutlinedButton(onClick = { onOptionSelected(option) }) {
                    Text(text = optionLabel(option))
                }
            }
        }
    }
}
