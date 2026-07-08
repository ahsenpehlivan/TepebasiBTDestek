package com.ahsen.tepebasibtdestek.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = TepebasiBlue,
    onPrimary = TepebasiSurface,
    primaryContainer = TepebasiBlueSoft,
    onPrimaryContainer = TepebasiBlueDark,
    secondary = TepebasiBlueDark,
    onSecondary = TepebasiSurface,
    background = TepebasiBackground,
    onBackground = TepebasiTextPrimary,
    surface = TepebasiSurface,
    onSurface = TepebasiTextPrimary,
    surfaceVariant = TepebasiSurfaceAlt,
    onSurfaceVariant = TepebasiTextSecondary,
    surfaceContainerLowest = TepebasiBackground,
    surfaceContainerLow = TepebasiSurfaceAlt,
    surfaceContainer = TepebasiSurfaceMuted,
    error = TepebasiDanger,
    onError = TepebasiSurface
)

@Composable
fun TepebasiBTDestekTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}
