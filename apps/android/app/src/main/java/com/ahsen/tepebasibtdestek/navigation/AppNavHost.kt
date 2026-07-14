package com.ahsen.tepebasibtdestek.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.ahsen.tepebasibtdestek.core.AppContainer
import com.ahsen.tepebasibtdestek.domain.auth.SessionState
import com.ahsen.tepebasibtdestek.feature.auth.LoginScreen
import com.ahsen.tepebasibtdestek.feature.auth.LoginViewModel
import com.ahsen.tepebasibtdestek.feature.home.AdminHomeScreen
import com.ahsen.tepebasibtdestek.feature.home.EmployeeHomeScreen
import com.ahsen.tepebasibtdestek.feature.home.HomeViewModel
import com.ahsen.tepebasibtdestek.feature.home.TechnicianHomeScreen
import com.ahsen.tepebasibtdestek.feature.session.AccessDeniedScreen
import com.ahsen.tepebasibtdestek.feature.session.AuthErrorScreen
import com.ahsen.tepebasibtdestek.feature.session.ConfigErrorScreen
import com.ahsen.tepebasibtdestek.feature.splash.SplashScreen
import com.ahsen.tepebasibtdestek.feature.splash.SplashViewModel

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
                onLogoutClick = homeViewModel::signOut
            )

            LaunchedEffect(uiState.logoutCompleted) {
                if (uiState.logoutCompleted) {
                    navigateAndClear(navController, AppRoute.Login)
                    homeViewModel.consumeLogout()
                }
            }
        }

        composable(AppRoute.TechnicianHome.route) {
            val homeViewModel: HomeViewModel = viewModel(
                factory = HomeViewModel.factory(appContainer.authRepository)
            )
            val uiState by homeViewModel.uiState.collectAsStateWithLifecycle()

            TechnicianHomeScreen(
                state = uiState,
                onLogoutClick = homeViewModel::signOut
            )

            LaunchedEffect(uiState.logoutCompleted) {
                if (uiState.logoutCompleted) {
                    navigateAndClear(navController, AppRoute.Login)
                    homeViewModel.consumeLogout()
                }
            }
        }

        composable(AppRoute.AdminHome.route) {
            val homeViewModel: HomeViewModel = viewModel(
                factory = HomeViewModel.factory(appContainer.authRepository)
            )
            val uiState by homeViewModel.uiState.collectAsStateWithLifecycle()

            AdminHomeScreen(
                state = uiState,
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
