package com.ahsen.tepebasibtdestek.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.ahsen.tepebasibtdestek.core.AppContainer
import com.ahsen.tepebasibtdestek.domain.auth.SessionState
import com.ahsen.tepebasibtdestek.feature.auth.LoginScreen
import com.ahsen.tepebasibtdestek.feature.auth.LoginViewModel
import com.ahsen.tepebasibtdestek.feature.devices.DeviceDetailScreen
import com.ahsen.tepebasibtdestek.feature.devices.DeviceDetailViewModel
import com.ahsen.tepebasibtdestek.feature.devices.DeviceListScreen
import com.ahsen.tepebasibtdestek.feature.devices.DeviceListViewModel
import com.ahsen.tepebasibtdestek.feature.home.AdminHomeScreen
import com.ahsen.tepebasibtdestek.feature.home.EmployeeHomeScreen
import com.ahsen.tepebasibtdestek.feature.home.HomeViewModel
import com.ahsen.tepebasibtdestek.feature.home.TechnicianHomeScreen
import com.ahsen.tepebasibtdestek.feature.session.AccessDeniedScreen
import com.ahsen.tepebasibtdestek.feature.session.AuthErrorScreen
import com.ahsen.tepebasibtdestek.feature.session.ConfigErrorScreen
import com.ahsen.tepebasibtdestek.feature.splash.SplashScreen
import com.ahsen.tepebasibtdestek.feature.splash.SplashViewModel
import com.ahsen.tepebasibtdestek.feature.tickets.CreateTicketScreen
import com.ahsen.tepebasibtdestek.feature.tickets.CreateTicketViewModel
import com.ahsen.tepebasibtdestek.feature.tickets.MyTicketsScreen
import com.ahsen.tepebasibtdestek.feature.tickets.MyTicketsViewModel
import com.ahsen.tepebasibtdestek.feature.tickets.TechnicianQueueScreen
import com.ahsen.tepebasibtdestek.feature.tickets.TechnicianQueueViewModel
import com.ahsen.tepebasibtdestek.feature.tickets.TicketDetailScreen
import com.ahsen.tepebasibtdestek.feature.tickets.TicketDetailViewModel
import kotlinx.coroutines.delay

@Composable
fun AppNavHost(
    appContainer: AppContainer,
    navController: NavHostController = rememberNavController()
) {
    val splashViewModel: SplashViewModel = viewModel(
        factory = SplashViewModel.factory(appContainer.authRepository)
    )
    val splashState by splashViewModel.state.collectAsStateWithLifecycle()
    val globalSessionState by appContainer.authRepository.sessionState.collectAsStateWithLifecycle()
    val currentBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = currentBackStackEntry?.destination?.route

    LaunchedEffect(globalSessionState, currentRoute) {
        if (globalSessionState == SessionState.Unauthenticated &&
            currentRoute in listOf(
                AppRoute.EmployeeHome.route,
                AppRoute.DeviceList.route,
                AppRoute.DeviceDetail.route,
                AppRoute.MyTickets.route,
                AppRoute.CreateTicket.route,
                AppRoute.TechnicianQueue.route,
                AppRoute.TicketDetail.route,
                AppRoute.TechnicianHome.route,
                AppRoute.AdminHome.route,
                AppRoute.AccessDenied.route,
                AppRoute.AuthError.route
            )
        ) {
            navigateAndClear(navController, AppRoute.Login)
        }
    }

    NavHost(
        navController = navController,
        startDestination = AppRoute.Splash.route
    ) {
        composable(AppRoute.Splash.route) {
            SplashScreen()

            LaunchedEffect(splashState) {
                if (splashState != SessionState.Loading) {
                    navigateAndClear(
                        navController = navController,
                        route = AppRoute.fromSessionState(splashState)
                    )
                }
            }
        }

        composable(AppRoute.Login.route) {
            val loginViewModel: LoginViewModel = viewModel(
                factory = LoginViewModel.factory(appContainer.authRepository)
            )
            val uiState by loginViewModel.uiState.collectAsStateWithLifecycle()

            LoginScreen(
                state = uiState,
                onEmailChanged = loginViewModel::onEmailChanged,
                onPasswordChanged = loginViewModel::onPasswordChanged,
                onLoginClick = loginViewModel::signIn
            )

            LaunchedEffect(uiState.nextState) {
                val nextState = uiState.nextState ?: return@LaunchedEffect
                when (nextState) {
                    is SessionState.Authenticated,
                    is SessionState.AccessDenied,
                    is SessionState.ConfigError,
                    is SessionState.Error -> {
                        navigateAndClear(
                            navController = navController,
                            route = AppRoute.fromSessionState(nextState)
                        )
                        loginViewModel.consumeNavigation()
                    }

                    SessionState.Loading,
                    SessionState.Unauthenticated -> Unit
                }
            }
        }

        composable(AppRoute.EmployeeHome.route) {
            val homeViewModel: HomeViewModel = viewModel(
                factory = HomeViewModel.factory(appContainer.authRepository)
            )
            val uiState by homeViewModel.uiState.collectAsStateWithLifecycle()

            EmployeeHomeScreen(
                state = uiState,
                onMyTicketsClick = {
                    navController.navigate(AppRoute.MyTickets.route)
                },
                onCreateTicketClick = {
                    navController.navigate(AppRoute.CreateTicket.route)
                },
                onDevicesClick = {
                    navController.navigate(AppRoute.DeviceList.route)
                },
                onLogoutClick = homeViewModel::signOut
            )

            LaunchedEffect(uiState.logoutCompleted) {
                if (uiState.logoutCompleted) {
                    navigateAndClear(navController, AppRoute.Login)
                    homeViewModel.consumeLogout()
                }
            }
        }

        composable(AppRoute.MyTickets.route) {
            val ticketsViewModel: MyTicketsViewModel = viewModel(
                factory = MyTicketsViewModel.factory(
                    authRepository = appContainer.authRepository,
                    ticketRepository = appContainer.ticketRepository
                )
            )
            val uiState by ticketsViewModel.uiState.collectAsStateWithLifecycle()

            MyTicketsScreen(
                state = uiState,
                onBackClick = {
                    if (!navController.popBackStack()) {
                        navController.navigate(AppRoute.EmployeeHome.route) {
                            launchSingleTop = true
                        }
                    }
                },
                onRetryClick = ticketsViewModel::refresh,
                onTicketClick = { ticketId ->
                    navController.navigate(AppRoute.TicketDetail.createRoute(ticketId))
                },
                onCreateTicketClick = {
                    navController.navigate(AppRoute.CreateTicket.route)
                }
            )
        }

        composable(AppRoute.DeviceList.route) {
            val deviceListViewModel: DeviceListViewModel = viewModel(
                factory = DeviceListViewModel.factory(
                    authRepository = appContainer.authRepository,
                    deviceRepository = appContainer.deviceRepository
                )
            )
            val uiState by deviceListViewModel.uiState.collectAsStateWithLifecycle()

            DeviceListScreen(
                state = uiState,
                onBackClick = {
                    if (!navController.popBackStack()) {
                        val fallbackRoute = when (
                            (globalSessionState as? SessionState.Authenticated)?.profile?.role
                        ) {
                            com.ahsen.tepebasibtdestek.domain.auth.AppRole.Technician ->
                                AppRoute.TechnicianHome.route
                            com.ahsen.tepebasibtdestek.domain.auth.AppRole.Admin ->
                                AppRoute.AdminHome.route
                            else -> AppRoute.EmployeeHome.route
                        }
                        navController.navigate(fallbackRoute) {
                            launchSingleTop = true
                        }
                    }
                },
                onRetryClick = deviceListViewModel::refresh,
                onDeviceClick = { deviceId ->
                    navController.navigate(AppRoute.DeviceDetail.createRoute(deviceId))
                }
            )
        }

        composable(
            route = AppRoute.DeviceDetail.route,
            arguments = listOf(
                navArgument(AppRoute.DeviceDetail.deviceIdArg) {
                    type = NavType.StringType
                }
            )
        ) { backStackEntry ->
            val deviceId = backStackEntry.arguments
                ?.getString(AppRoute.DeviceDetail.deviceIdArg)
                .orEmpty()
            val detailViewModel: DeviceDetailViewModel = viewModel(
                factory = DeviceDetailViewModel.factory(
                    deviceId = deviceId,
                    authRepository = appContainer.authRepository,
                    deviceRepository = appContainer.deviceRepository
                )
            )
            val uiState by detailViewModel.uiState.collectAsStateWithLifecycle()

            DeviceDetailScreen(
                state = uiState,
                onBackClick = {
                    if (!navController.popBackStack()) {
                        navController.navigate(AppRoute.DeviceList.route) {
                            launchSingleTop = true
                        }
                    }
                },
                onRetryClick = detailViewModel::refresh
            )
        }

        composable(AppRoute.CreateTicket.route) {
            val createTicketViewModel: CreateTicketViewModel = viewModel(
                factory = CreateTicketViewModel.factory(
                    authRepository = appContainer.authRepository,
                    ticketRepository = appContainer.ticketRepository
                )
            )
            val uiState by createTicketViewModel.uiState.collectAsStateWithLifecycle()

            CreateTicketScreen(
                state = uiState,
                onTitleChanged = createTicketViewModel::onTitleChanged,
                onDescriptionChanged = createTicketViewModel::onDescriptionChanged,
                onCategorySelected = createTicketViewModel::onCategorySelected,
                onPrioritySelected = createTicketViewModel::onPrioritySelected,
                onSaveClick = createTicketViewModel::submit,
                onCancelClick = {
                    if (!navController.popBackStack()) {
                        navController.navigate(AppRoute.EmployeeHome.route) {
                            launchSingleTop = true
                        }
                    }
                }
            )

            LaunchedEffect(uiState.createdTicketId, uiState.navigateToMyTickets) {
                val createdTicketId = uiState.createdTicketId
                if (createdTicketId != null || uiState.navigateToMyTickets) {
                    delay(600)
                    if (!createdTicketId.isNullOrBlank()) {
                        navController.navigate(AppRoute.TicketDetail.createRoute(createdTicketId)) {
                            popUpTo(AppRoute.CreateTicket.route) {
                                inclusive = true
                            }
                            launchSingleTop = true
                        }
                    } else {
                        navController.navigate(AppRoute.MyTickets.route) {
                            popUpTo(AppRoute.CreateTicket.route) {
                                inclusive = true
                            }
                            launchSingleTop = true
                        }
                    }
                    createTicketViewModel.consumeNavigation()
                }
            }
        }

        composable(
            route = AppRoute.TicketDetail.route,
            arguments = listOf(
                navArgument(AppRoute.TicketDetail.ticketIdArg) {
                    type = NavType.StringType
                }
            )
        ) { backStackEntry ->
            val ticketId = backStackEntry.arguments
                ?.getString(AppRoute.TicketDetail.ticketIdArg)
                .orEmpty()
            val detailViewModel: TicketDetailViewModel = viewModel(
                factory = TicketDetailViewModel.factory(
                    ticketId = ticketId,
                    authRepository = appContainer.authRepository,
                    ticketRepository = appContainer.ticketRepository
                )
            )
            val uiState by detailViewModel.uiState.collectAsStateWithLifecycle()

            TicketDetailScreen(
                state = uiState,
                onBackClick = {
                    if (!navController.popBackStack()) {
                        val fallbackRoute = when (
                            (globalSessionState as? SessionState.Authenticated)?.profile?.role
                        ) {
                            com.ahsen.tepebasibtdestek.domain.auth.AppRole.Technician ->
                                AppRoute.TechnicianHome.route
                            com.ahsen.tepebasibtdestek.domain.auth.AppRole.Admin ->
                                AppRoute.AdminHome.route
                            else -> AppRoute.MyTickets.route
                        }
                        navController.navigate(fallbackRoute) {
                            launchSingleTop = true
                        }
                    }
                },
                onRetryClick = detailViewModel::refresh,
                onUpdateStatus = detailViewModel::updateStatus,
                onCommentBodyChanged = detailViewModel::onCommentBodyChanged,
                onInternalCommentChanged = detailViewModel::onInternalCommentChanged,
                onSubmitComment = detailViewModel::submitComment
            )
        }

        composable(AppRoute.TechnicianHome.route) {
            val homeViewModel: HomeViewModel = viewModel(
                factory = HomeViewModel.factory(appContainer.authRepository)
            )
            val uiState by homeViewModel.uiState.collectAsStateWithLifecycle()

            TechnicianHomeScreen(
                state = uiState,
                onQueueClick = {
                    navController.navigate(AppRoute.TechnicianQueue.route)
                },
                onDeviceListClick = {
                    navController.navigate(AppRoute.DeviceList.route)
                },
                onLogoutClick = homeViewModel::signOut
            )

            LaunchedEffect(uiState.logoutCompleted) {
                if (uiState.logoutCompleted) {
                    navigateAndClear(navController, AppRoute.Login)
                    homeViewModel.consumeLogout()
                }
            }
        }

        composable(AppRoute.TechnicianQueue.route) {
            val queueViewModel: TechnicianQueueViewModel = viewModel(
                factory = TechnicianQueueViewModel.factory(
                    authRepository = appContainer.authRepository,
                    ticketRepository = appContainer.ticketRepository
                )
            )
            val uiState by queueViewModel.uiState.collectAsStateWithLifecycle()

            TechnicianQueueScreen(
                state = uiState,
                onBackClick = {
                    if (!navController.popBackStack()) {
                        navController.navigate(AppRoute.TechnicianHome.route) {
                            launchSingleTop = true
                        }
                    }
                },
                onRetryClick = queueViewModel::refresh,
                onTicketClick = { ticketId ->
                    navController.navigate(AppRoute.TicketDetail.createRoute(ticketId))
                }
            )
        }

        composable(AppRoute.AdminHome.route) {
            val homeViewModel: HomeViewModel = viewModel(
                factory = HomeViewModel.factory(appContainer.authRepository)
            )
            val uiState by homeViewModel.uiState.collectAsStateWithLifecycle()

            AdminHomeScreen(
                state = uiState,
                onDeviceListClick = {
                    navController.navigate(AppRoute.DeviceList.route)
                },
                onLogoutClick = homeViewModel::signOut
            )

            LaunchedEffect(uiState.logoutCompleted) {
                if (uiState.logoutCompleted) {
                    navigateAndClear(navController, AppRoute.Login)
                    homeViewModel.consumeLogout()
                }
            }
        }

        composable(AppRoute.AccessDenied.route) {
            val homeViewModel: HomeViewModel = viewModel(
                factory = HomeViewModel.factory(appContainer.authRepository)
            )
            val uiState by homeViewModel.uiState.collectAsStateWithLifecycle()
            val message = (globalSessionState as? SessionState.AccessDenied)?.message
                ?: "Bu hesaba şu anda mobil panel erişimi verilemiyor."

            AccessDeniedScreen(
                message = message,
                logoutLoading = uiState.isLogoutLoading,
                logoutErrorMessage = uiState.logoutErrorMessage,
                onLogoutClick = homeViewModel::signOut
            )

            LaunchedEffect(uiState.logoutCompleted) {
                if (uiState.logoutCompleted) {
                    navigateAndClear(navController, AppRoute.Login)
                    homeViewModel.consumeLogout()
                }
            }
        }

        composable(AppRoute.AuthError.route) {
            val homeViewModel: HomeViewModel = viewModel(
                factory = HomeViewModel.factory(appContainer.authRepository)
            )
            val uiState by homeViewModel.uiState.collectAsStateWithLifecycle()
            val message = (globalSessionState as? SessionState.Error)?.message
                ?: "Kimlik doğrulama sonrası profil bilgisi okunamadı."

            AuthErrorScreen(
                message = message,
                logoutLoading = uiState.isLogoutLoading,
                logoutErrorMessage = uiState.logoutErrorMessage,
                onLogoutClick = homeViewModel::signOut
            )

            LaunchedEffect(uiState.logoutCompleted) {
                if (uiState.logoutCompleted) {
                    navigateAndClear(navController, AppRoute.Login)
                    homeViewModel.consumeLogout()
                }
            }
        }

        composable(AppRoute.ConfigError.route) {
            val message = (globalSessionState as? SessionState.ConfigError)?.message
                ?: "Supabase yapılandırması eksik."

            ConfigErrorScreen(
                message = message,
                onRetryClick = {
                    navigateAndClear(navController, AppRoute.Splash)
                    splashViewModel.refresh()
                }
            )
        }
    }
}

private fun navigateAndClear(
    navController: NavHostController,
    route: AppRoute
) {
    navController.navigate(route.route) {
        popUpTo(navController.graph.findStartDestination().id) {
            inclusive = true
        }
        launchSingleTop = true
    }
}
