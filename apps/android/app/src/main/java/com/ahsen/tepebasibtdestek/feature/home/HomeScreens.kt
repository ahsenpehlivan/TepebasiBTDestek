package com.ahsen.tepebasibtdestek.feature.home

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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.ahsen.tepebasibtdestek.R
import com.ahsen.tepebasibtdestek.core.ui.ScreenScaffold
import com.ahsen.tepebasibtdestek.core.ui.toTurkishLabel
import com.ahsen.tepebasibtdestek.domain.auth.AuthenticatedProfile

@Composable
fun EmployeeHomeScreen(
    state: HomeUiState,
    onLogoutClick: () -> Unit
) {
    RoleHomeScreen(
        profile = state.profile,
        title = stringResource(R.string.employee_home_title),
        description = stringResource(R.string.employee_home_description),
        secondaryDescription = stringResource(R.string.employee_home_secondary_description),
        logoutLoading = state.isLogoutLoading,
        logoutErrorMessage = state.logoutErrorMessage,
        onLogoutClick = onLogoutClick
    )
}

@Composable
fun TechnicianHomeScreen(
    state: HomeUiState,
    onLogoutClick: () -> Unit
) {
    RoleHomeScreen(
        profile = state.profile,
        title = stringResource(R.string.technician_home_title),
        description = stringResource(R.string.technician_home_description),
        secondaryDescription = stringResource(R.string.technician_home_secondary_description),
        logoutLoading = state.isLogoutLoading,
        logoutErrorMessage = state.logoutErrorMessage,
        onLogoutClick = onLogoutClick
    )
}

@Composable
fun AdminHomeScreen(
    state: HomeUiState,
    onLogoutClick: () -> Unit
) {
    RoleHomeScreen(
        profile = state.profile,
        title = stringResource(R.string.admin_home_title),
        description = stringResource(R.string.admin_home_description),
        secondaryDescription = stringResource(R.string.admin_home_secondary_description),
        logoutLoading = state.isLogoutLoading,
        logoutErrorMessage = state.logoutErrorMessage,
        onLogoutClick = onLogoutClick
    )
}

@Composable
private fun RoleHomeScreen(
    profile: AuthenticatedProfile?,
    title: String,
    description: String,
    secondaryDescription: String,
    logoutLoading: Boolean,
    logoutErrorMessage: String?,
    onLogoutClick: () -> Unit
) {
    ScreenScaffold { contentPadding: PaddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(contentPadding)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.Center
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.headlineSmall,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Text(
                        text = profile?.fullName ?: stringResource(R.string.common_unknown_user),
                        style = MaterialTheme.typography.titleLarge,
                        color = MaterialTheme.colorScheme.primary
                    )

                    Text(
                        text = stringResource(
                            R.string.home_role_label,
                            profile?.role?.toTurkishLabel()
                                ?: stringResource(R.string.common_unknown_role)
                        ),
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Text(
                        text = description,
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Text(
                        text = secondaryDescription,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    if (!logoutErrorMessage.isNullOrBlank()) {
                        Text(
                            text = logoutErrorMessage,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.error
                        )
                    }

                    Button(
                        onClick = onLogoutClick,
                        modifier = Modifier.fillMaxWidth(),
                        enabled = !logoutLoading
                    ) {
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
        }
    }
}
