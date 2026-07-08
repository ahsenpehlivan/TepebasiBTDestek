package com.ahsen.tepebasibtdestek.data.profile

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ProfileDto(
    val id: String,
    @SerialName("full_name")
    val fullName: String? = null,
    val role: String,
    @SerialName("department_id")
    val departmentId: String? = null,
    @SerialName("job_title")
    val jobTitle: String? = null,
    @SerialName("is_active")
    val isActive: Boolean = true
)
