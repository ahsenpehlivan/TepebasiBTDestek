package com.ahsen.tepebasibtdestek.feature.session

import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import com.ahsen.tepebasibtdestek.R
import com.ahsen.tepebasibtdestek.core.ui.CenteredStatusCard

@Composable
fun AccessDeniedScreen(
    message: String,
    logoutLoading: Boolean,
    logoutErrorMessage: String?,
    onLogoutClick: () -> Unit
) {
    CenteredStatusCard(
        eyebrow = stringResource(R.string.access_denied_eyebrow),
        title = stringResource(R.string.access_denied_title),
        description = message,
        action = {
            Column {
                if (!logoutErrorMessage.isNullOrBlank()) {
                    Text(
                        text = logoutErrorMessage,
                        color = MaterialTheme.colorScheme.error
                    )
                }
                Button(onClick = onLogoutClick, enabled = !logoutLoading) {
                    Text(
                        text = if (logoutLoading) {
                            stringResource(R.string.logout_loading)
                        } else {
                            stringResource(R.string.logout_button)
                        }
                    )
                }
            }
        }
    )
}

@Composable
fun AuthErrorScreen(
    message: String,
    logoutLoading: Boolean,
    logoutErrorMessage: String?,
    onLogoutClick: () -> Unit
) {
    CenteredStatusCard(
        eyebrow = stringResource(R.string.auth_error_eyebrow),
        title = stringResource(R.string.auth_error_title),
        description = message,
        action = {
            Column {
                if (!logoutErrorMessage.isNullOrBlank()) {
                    Text(
                        text = logoutErrorMessage,
                        color = MaterialTheme.colorScheme.error
                    )
                }
                Button(onClick = onLogoutClick, enabled = !logoutLoading) {
                    Text(
                        text = if (logoutLoading) {
                            stringResource(R.string.logout_loading)
                        } else {
                            stringResource(R.string.logout_button)
                        }
                    )
                }
            }
        }
    )
}

@Composable
fun ConfigErrorScreen(
    message: String,
    onRetryClick: () -> Unit
) {
    CenteredStatusCard(
        eyebrow = stringResource(R.string.config_error_eyebrow),
        title = stringResource(R.string.config_error_title),
        description = message,
        action = {
            Button(onClick = onRetryClick) {
                Text(text = stringResource(R.string.config_error_retry))
            }
        }
    )
}
