package com.ahsen.tepebasibtdestek.domain.auth

data class AuthenticatedProfile(
    val id: String,
    val fullName: String,
    val role: AppRole,
    val departmentId: String?,
    val jobTitle: String?,
    val isActive: Boolean
)
