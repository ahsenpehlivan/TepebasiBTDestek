package com.ahsen.tepebasibtdestek.feature.devices

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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ahsen.tepebasibtdestek.R
import com.ahsen.tepebasibtdestek.core.ui.CenteredStatusCard
import com.ahsen.tepebasibtdestek.core.ui.ScreenScaffold

@Composable
fun DeviceDetailScreen(
    state: DeviceDetailUiState,
    onBackClick: () -> Unit,
    onRetryClick: () -> Unit
) {
    when {
        state.isLoading -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.device_detail_eyebrow),
                title = stringResource(R.string.device_detail_title),
                description = stringResource(R.string.common_loading)
            )
        }

        !state.errorMessage.isNullOrBlank() -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.device_detail_eyebrow),
                title = stringResource(R.string.device_detail_title),
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

        state.detail != null -> {
            DeviceDetailContent(
                state = state,
                onBackClick = onBackClick
            )
        }
    }
}

@Composable
private fun DeviceDetailContent(
    state: DeviceDetailUiState,
    onBackClick: () -> Unit
) {
    val detail = state.detail ?: return

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
                    text = stringResource(R.string.device_detail_eyebrow),
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = stringResource(R.string.device_detail_title),
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = detail.assetTag,
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                OutlinedButton(onClick = onBackClick) {
                    Text(text = stringResource(R.string.common_back))
                }
            }

            DeviceSectionCard(title = stringResource(R.string.device_detail_identity_section)) {
                DeviceBadge(
                    text = stringResource(detail.status.labelResId()),
                    containerColor = detail.status.containerColor(MaterialTheme.colorScheme),
                    contentColor = detail.status.contentColor(MaterialTheme.colorScheme)
                )
                DeviceDetailLine(
                    label = stringResource(R.string.device_asset_tag_label),
                    value = detail.assetTag
                )
                DeviceDetailLine(
                    label = stringResource(R.string.device_type_label),
                    value = stringResource(detail.type.labelResId())
                )
                DeviceDetailLine(
                    label = stringResource(R.string.device_brand_model_label),
                    value = buildBrandModelLabel(detail.brand, detail.model)
                )
                if (!detail.serialNumber.isNullOrBlank()) {
                    DeviceDetailLine(
                        label = stringResource(R.string.device_serial_number_label),
                        value = maskSerialNumber(detail.serialNumber)
                    )
                }
            }

            DeviceSectionCard(title = stringResource(R.string.device_detail_status_section)) {
                DeviceDetailLine(
                    label = stringResource(R.string.device_detail_status_label),
                    value = stringResource(detail.status.labelResId())
                )
                DeviceDetailLine(
                    label = stringResource(R.string.device_detail_record_label),
                    value = stringResource(
                        if (detail.isActive) {
                            R.string.device_active_badge
                        } else {
                            R.string.device_inactive_badge
                        }
                    )
                )
            }

            DeviceSectionCard(title = stringResource(R.string.device_detail_assignment_section)) {
                DeviceDetailLine(
                    label = stringResource(R.string.device_assigned_user_label),
                    value = detail.assignedUserName
                        ?: stringResource(R.string.device_unassigned_value)
                )
                DeviceDetailLine(
                    label = stringResource(R.string.device_department_label),
                    value = detail.departmentName
                        ?: stringResource(R.string.device_unassigned_value)
                )
            }

            DeviceSectionCard(title = stringResource(R.string.device_detail_dates_section)) {
                if (!detail.purchaseDate.isNullOrBlank()) {
                    DeviceDetailLine(
                        label = stringResource(R.string.device_purchase_date_label),
                        value = formatDeviceDateValue(detail.purchaseDate)
                    )
                }
                if (!detail.warrantyEndDate.isNullOrBlank()) {
                    DeviceDetailLine(
                        label = stringResource(R.string.device_warranty_end_date_label),
                        value = formatDeviceDateValue(detail.warrantyEndDate)
                    )
                }
                if (detail.purchaseDate.isNullOrBlank() && detail.warrantyEndDate.isNullOrBlank()) {
                    Text(
                        text = stringResource(R.string.device_dates_empty_message),
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            DeviceSectionCard(title = stringResource(R.string.device_detail_notes_section)) {
                Text(
                    text = detail.notes
                        ?: stringResource(R.string.device_notes_empty_message),
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun DeviceSectionCard(
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
