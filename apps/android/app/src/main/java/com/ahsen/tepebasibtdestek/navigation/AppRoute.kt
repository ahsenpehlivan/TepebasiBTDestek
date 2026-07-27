package com.ahsen.tepebasibtdestek.navigation

import com.ahsen.tepebasibtdestek.domain.auth.AppRole
import com.ahsen.tepebasibtdestek.domain.auth.SessionState

sealed class AppRoute(val route: String) {
    data object Splash : AppRoute("splash")
    data object Login : AppRoute("login")
    data object EmployeeHome : AppRoute("employee_home")
    data object MyTickets : AppRoute("my_tickets")
    data object CreateTicket : AppRoute("create_ticket")
    data object TicketDetail : AppRoute("ticket_detail/{ticketId}") {
        const val ticketIdArg = "ticketId"

        fun createRoute(ticketId: String): String = "ticket_detail/$ticketId"
    }
    data object TechnicianHome : AppRoute("technician_home")
    data object AdminHome : AppRoute("admin_home")
    data object AccessDenied : AppRoute("access_denied")
    data object AuthError : AppRoute("auth_error")
    data object ConfigError : AppRoute("config_error")

    companion object {
        fun fromSessionState(state: SessionState): AppRoute = when (state) {
            is SessionState.Authenticated -> fromRole(state.profile.role)
            is SessionState.AccessDenied -> AccessDenied
            is SessionState.ConfigError -> ConfigError
            is SessionState.Error -> AuthError
            SessionState.Loading -> Splash
            SessionState.Unauthenticated -> Login
        }

        fun fromRole(role: AppRole): AppRoute = when (role) {
            AppRole.Employee -> EmployeeHome
            AppRole.Technician -> TechnicianHome
            AppRole.Admin -> AdminHome
        }
    }
}
