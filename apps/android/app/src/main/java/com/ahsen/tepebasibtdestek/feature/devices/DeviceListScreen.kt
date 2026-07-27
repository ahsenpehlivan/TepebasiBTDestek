package com.ahsen.tepebasibtdestek.feature.devices

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.ahsen.tepebasibtdestek.R
import com.ahsen.tepebasibtdestek.core.ui.CenteredStatusCard
import com.ahsen.tepebasibtdestek.core.ui.ScreenScaffold

@Composable
fun DeviceListScreen(
    state: DeviceListUiState,
    onBackClick: () -> Unit,
    onRetryClick: () -> Unit
) {
    when {
        state.isLoading -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.device_list_eyebrow),
                title = stringResource(R.string.device_list_title),
                description = stringResource(R.string.common_loading)
            )
        }

        !state.errorMessage.isNullOrBlank() -> {
            CenteredStatusCard(
                eyebrow = stringResource(R.string.device_list_eyebrow),
                title = stringResource(R.string.device_list_title),
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
                eyebrow = stringResource(R.string.device_list_eyebrow),
                title = stringResource(R.string.device_list_title),
                description = stringResource(R.string.device_list_empty_message),
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
                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Text(
                                text = stringResource(R.string.device_list_eyebrow),
                                style = MaterialTheme.typography.labelLarge,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = stringResource(R.string.device_list_title),
                                style = MaterialTheme.typography.headlineSmall,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = stringResource(R.string.device_list_description),
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            OutlinedButton(onClick = onBackClick) {
                                Text(text = stringResource(R.string.common_back))
                            }
                        }
                    }

                    items(
                        items = state.devices,
                        key = { device -> device.id }
                    ) { device ->
                        DeviceSummaryCard(device = device)
                    }
                }
            }
        }
    }
}
