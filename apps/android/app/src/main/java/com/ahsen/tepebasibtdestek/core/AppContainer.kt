package com.ahsen.tepebasibtdestek.core

import com.ahsen.tepebasibtdestek.data.auth.SupabaseAuthRepository
import com.ahsen.tepebasibtdestek.data.device.DeviceRepository
import com.ahsen.tepebasibtdestek.data.device.SupabaseDeviceRepository
import com.ahsen.tepebasibtdestek.data.remote.supabase.SupabaseClientProvider
import com.ahsen.tepebasibtdestek.data.ticket.SupabaseTicketRepository
import com.ahsen.tepebasibtdestek.data.ticket.TicketRepository
import com.ahsen.tepebasibtdestek.domain.auth.AuthRepository

class AppContainer {
    private val supabaseClientProvider = SupabaseClientProvider()

    val authRepository: AuthRepository = SupabaseAuthRepository(
        clientProvider = supabaseClientProvider
    )

    val ticketRepository: TicketRepository = SupabaseTicketRepository(
        clientProvider = supabaseClientProvider
    )

    val deviceRepository: DeviceRepository = SupabaseDeviceRepository(
        clientProvider = supabaseClientProvider
    )
}
