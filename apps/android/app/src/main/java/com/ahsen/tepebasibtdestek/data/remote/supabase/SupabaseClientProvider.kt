package com.ahsen.tepebasibtdestek.data.remote.supabase

import com.ahsen.tepebasibtdestek.core.config.SupabaseConfig
import com.ahsen.tepebasibtdestek.core.result.AppResult
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest

class SupabaseClientProvider {
    private val configResult = SupabaseConfig.fromBuildConfig()

    private val client: SupabaseClient? by lazy {
        when (val result = configResult) {
            is AppResult.Success -> createSupabaseClient(
                supabaseUrl = result.value.url,
                supabaseKey = result.value.publishableKey
            ) {
                install(Auth)
                install(Postgrest)
            }

            is AppResult.Failure -> null
        }
    }

    fun getClient(): AppResult<SupabaseClient> {
        return client?.let { AppResult.Success(it) }
            ?: AppResult.Failure(SupabaseConfig.MISSING_CONFIG_MESSAGE)
    }
}
