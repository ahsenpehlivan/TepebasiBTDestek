package com.ahsen.tepebasibtdestek.core.config

import com.ahsen.tepebasibtdestek.BuildConfig
import com.ahsen.tepebasibtdestek.core.result.AppResult

data class SupabaseConfig(
    val url: String,
    val publishableKey: String
) {
    companion object {
        const val MISSING_CONFIG_MESSAGE =
            "Supabase yapilandirmasi eksik. Lutfen Android secrets.properties dosyasini kontrol edin."

        fun fromBuildConfig(): AppResult<SupabaseConfig> {
            val url = BuildConfig.SUPABASE_URL.trim()
            val key = BuildConfig.SUPABASE_PUBLISHABLE_KEY.trim()

            return if (url.isBlank() || key.isBlank()) {
                AppResult.Failure(MISSING_CONFIG_MESSAGE)
            } else {
                AppResult.Success(
                    SupabaseConfig(
                        url = url,
                        publishableKey = key
                    )
                )
            }
        }
    }
}
