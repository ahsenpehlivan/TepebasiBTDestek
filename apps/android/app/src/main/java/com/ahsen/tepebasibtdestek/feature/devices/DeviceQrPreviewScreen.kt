package com.ahsen.tepebasibtdestek.feature.devices

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
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
fun DeviceQrPreviewScreen(
    state: DeviceQrPreviewUiState,
    onBackClick: () -> Unit,
    onRetryClick: () -> Unit
) {
    when {
        state.isLoading -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.device_qr_preview_eyebrow),
                title = stringResource(R.string.device_qr_preview_title),
                description = stringResource(R.string.common_loading)
            )
        }

        !state.errorMessage.isNullOrBlank() -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.device_qr_preview_eyebrow),
                title = stringResource(R.string.device_qr_preview_title),
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

        else -> {
            DeviceQrPreviewContent(
                state = state,
                onBackClick = onBackClick
            )
        }
    }
}

@Composable
private fun DeviceQrPreviewContent(
    state: DeviceQrPreviewUiState,
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
                    text = stringResource(R.string.device_qr_preview_eyebrow),
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = stringResource(R.string.device_qr_preview_title),
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.onSurface
                )
                OutlinedButton(onClick = onBackClick) {
                    Text(text = stringResource(R.string.common_back))
                }
            }

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
                        text = stringResource(R.string.device_qr_info_section_title),
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.SemiBold
                    )
                    state.assetTag?.let { assetTag ->
                        DeviceDetailLine(
                            label = stringResource(R.string.device_asset_tag_label),
                            value = assetTag
                        )
                    }
                    state.deviceTypeLabel?.let { deviceTypeLabel ->
                        DeviceDetailLine(
                            label = stringResource(R.string.device_type_label),
                            value = deviceTypeLabel
                        )
                    }
                    DeviceDetailLine(
                        label = stringResource(R.string.device_qr_payload_label),
                        value = state.qrPayload ?: stringResource(R.string.device_qr_missing_message)
                    )
                    Text(
                        text = stringResource(R.string.device_qr_description),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    state.emptyMessage?.let { emptyMessage ->
                        Text(
                            text = emptyMessage,
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}
