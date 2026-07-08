package com.ahsen.tepebasibtdestek.data.profile

import com.ahsen.tepebasibtdestek.domain.auth.AppRole
import com.ahsen.tepebasibtdestek.domain.auth.AuthenticatedProfile

fun ProfileDto.toDomain(): AuthenticatedProfile? {
    val appRole = when (role.lowercase()) {
        "employee" -> AppRole.Employee
        "technician" -> AppRole.Technician
        "admin" -> AppRole.Admin
        else -> null
    } ?: return null

    return AuthenticatedProfile(
        id = id,
        fullName = fullName?.takeIf { it.isNotBlank() } ?: "Demo Kullanici",
        role = appRole,
        departmentId = departmentId,
        jobTitle = jobTitle,
        isActive = isActive
    )
}
