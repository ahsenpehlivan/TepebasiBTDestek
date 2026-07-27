package com.ahsen.tepebasibtdestek.data.device

import com.ahsen.tepebasibtdestek.core.result.AppResult
import com.ahsen.tepebasibtdestek.data.remote.supabase.SupabaseClientProvider
import com.ahsen.tepebasibtdestek.domain.device.DeviceDetail
import com.ahsen.tepebasibtdestek.domain.device.DeviceMaintenanceRecord
import com.ahsen.tepebasibtdestek.domain.device.DeviceStatus
import com.ahsen.tepebasibtdestek.domain.device.DeviceSummary
import com.ahsen.tepebasibtdestek.domain.device.DeviceType
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

private const val DEFAULT_DEVICE_LOAD_ERROR_MESSAGE =
    "Cihazlar yüklenemedi. Lütfen tekrar deneyin."
private const val DEFAULT_DEVICE_DETAIL_ERROR_MESSAGE =
    "Cihaz bilgileri yüklenemedi. Lütfen tekrar deneyin."
private const val DEFAULT_DEVICE_MAINTENANCE_ERROR_MESSAGE =
    "Bakım kayıtları yüklenemedi. Lütfen tekrar deneyin."
private const val DEVICE_NOT_FOUND_MESSAGE =
    "Cihaz bulunamadı veya bu cihaza erişim izniniz yok."

class SupabaseDeviceRepository(
    private val clientProvider: SupabaseClientProvider
) : DeviceRepository {
    override suspend fun loadDevices(): Result<List<DeviceSummary>> {
        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> {
                return Result.failure(IllegalStateException(DEFAULT_DEVICE_LOAD_ERROR_MESSAGE))
            }
        }

        return try {
            val deviceRows = client.postgrest
                .from("devices")
                .select(
                    columns = Columns.list(
                        "id",
                        "asset_tag",
                        "qr_token",
                        "device_type",
                        "brand",
                        "model",
                        "status",
                        "department_id",
                        "assigned_user_id",
                        "is_active"
                    )
                ) {
                    order(column = "is_active", order = Order.DESCENDING)
                    order(column = "asset_tag", order = Order.ASCENDING)
                }
                .decodeList<DeviceRowDto>()

            val departmentNames = loadDepartmentNames(
                client = client,
                departmentIds = deviceRows.mapNotNull { it.departmentId }.distinct()
            )
            val assignedUserNames = loadProfileNames(
                client = client,
                profileIds = deviceRows.mapNotNull { it.assignedUserId }.distinct()
            )

            Result.success(
                deviceRows.mapNotNull { row ->
                    row.toSummary(
                        departmentName = row.departmentId?.let(departmentNames::get),
                        assignedUserName = row.assignedUserId?.let(assignedUserNames::get)
                    )
                }
            )
        } catch (_: Exception) {
            Result.failure(IllegalStateException(DEFAULT_DEVICE_LOAD_ERROR_MESSAGE))
        }
    }

    override suspend fun loadDeviceDetail(deviceId: String): Result<DeviceDetail> {
        if (deviceId.isBlank()) {
            return Result.failure(IllegalStateException(DEVICE_NOT_FOUND_MESSAGE))
        }

        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> {
                return Result.failure(IllegalStateException(DEFAULT_DEVICE_DETAIL_ERROR_MESSAGE))
            }
        }

        return try {
            val row = client.postgrest
                .from("devices")
                .select(
                    columns = Columns.list(
                        "id",
                        "asset_tag",
                        "device_type",
                        "brand",
                        "model",
                        "serial_number",
                        "status",
                        "department_id",
                        "assigned_user_id",
                        "purchase_date",
                        "warranty_end_date",
                        "notes",
                        "is_active"
                    )
                ) {
                    filter {
                        eq("id", deviceId)
                    }
                }
                .decodeList<DeviceDetailRowDto>()
                .firstOrNull()
                ?: return Result.failure(IllegalStateException(DEVICE_NOT_FOUND_MESSAGE))

            val departmentName = row.departmentId?.let { id ->
                loadDepartmentNames(client = client, departmentIds = listOf(id))[id]
            }
            val assignedUserName = row.assignedUserId?.let { id ->
                loadProfileNames(client = client, profileIds = listOf(id))[id]
            }

            val detail = row.toDetail(
                departmentName = departmentName,
                assignedUserName = assignedUserName
            ) ?: return Result.failure(IllegalStateException(DEFAULT_DEVICE_DETAIL_ERROR_MESSAGE))

            Result.success(detail)
        } catch (_: Exception) {
            Result.failure(IllegalStateException(DEFAULT_DEVICE_DETAIL_ERROR_MESSAGE))
        }
    }

    override suspend fun loadMaintenanceRecords(
        deviceId: String
    ): Result<List<DeviceMaintenanceRecord>> {
        if (deviceId.isBlank()) {
            return Result.failure(IllegalStateException(DEFAULT_DEVICE_MAINTENANCE_ERROR_MESSAGE))
        }

        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> {
                return Result.failure(
                    IllegalStateException(DEFAULT_DEVICE_MAINTENANCE_ERROR_MESSAGE)
                )
            }
        }

        return try {
            val maintenanceRows = client.postgrest
                .from("device_maintenance_records")
                .select(
                    columns = Columns.list(
                        "id",
                        "device_id",
                        "description",
                        "performed_by",
                        "performed_at",
                        "cost"
                    )
                ) {
                    filter {
                        eq("device_id", deviceId)
                    }
                    order(column = "performed_at", order = Order.DESCENDING)
                }
                .decodeList<DeviceMaintenanceRowDto>()

            val performerNames = loadProfileNames(
                client = client,
                profileIds = maintenanceRows.map { it.performedBy }.distinct()
            )

            Result.success(
                maintenanceRows.map { row ->
                    row.toMaintenanceRecord(
                        performedByName = performerNames[row.performedBy]
                    )
                }
            )
        } catch (_: Exception) {
            Result.failure(IllegalStateException(DEFAULT_DEVICE_MAINTENANCE_ERROR_MESSAGE))
        }
    }

    private suspend fun loadDepartmentNames(
        client: SupabaseClient,
        departmentIds: List<String>
    ): Map<String, String> {
        if (departmentIds.isEmpty()) {
            return emptyMap()
        }

        return try {
            client.postgrest
                .from("departments")
                .select(columns = Columns.list("id", "name")) {
                    filter {
                        isIn("id", departmentIds)
                    }
                }
                .decodeList<DepartmentNameDto>()
                .associate { department -> department.id to department.name.trim() }
        } catch (_: Exception) {
            emptyMap()
        }
    }

    private suspend fun loadProfileNames(
        client: SupabaseClient,
        profileIds: List<String>
    ): Map<String, String> {
        if (profileIds.isEmpty()) {
            return emptyMap()
        }

        return try {
            client.postgrest
                .from("profiles")
                .select(columns = Columns.list("id", "full_name")) {
                    filter {
                        isIn("id", profileIds)
                    }
                }
                .decodeList<ProfileNameDto>()
                .mapNotNull { profile ->
                    val fullName = profile.fullName?.trim()?.takeIf { it.isNotEmpty() }
                        ?: return@mapNotNull null
                    profile.id to fullName
                }
                .toMap()
        } catch (_: Exception) {
            emptyMap()
        }
    }
}

private fun DeviceRowDto.toSummary(
    departmentName: String?,
    assignedUserName: String?
): DeviceSummary? {
    val mappedType = DeviceType.fromRawValue(deviceType) ?: return null
    val mappedStatus = DeviceStatus.fromRawValue(status) ?: return null

    return DeviceSummary(
        id = id,
        assetTag = assetTag.trim(),
        type = mappedType,
        brand = brand.trim().takeIf { it.isNotEmpty() },
        model = model.trim().takeIf { it.isNotEmpty() },
        status = mappedStatus,
        departmentName = departmentName,
        assignedUserName = assignedUserName,
        isActive = isActive
    )
}

private fun DeviceDetailRowDto.toDetail(
    departmentName: String?,
    assignedUserName: String?
): DeviceDetail? {
    val mappedType = DeviceType.fromRawValue(deviceType) ?: return null
    val mappedStatus = DeviceStatus.fromRawValue(status) ?: return null

    return DeviceDetail(
        id = id,
        assetTag = assetTag.trim(),
        type = mappedType,
        qrToken = qrToken?.trim()?.takeIf { it.isNotEmpty() },
        brand = brand.trim().takeIf { it.isNotEmpty() },
        model = model.trim().takeIf { it.isNotEmpty() },
        serialNumber = serialNumber?.trim()?.takeIf { it.isNotEmpty() },
        status = mappedStatus,
        departmentName = departmentName,
        assignedUserName = assignedUserName,
        purchaseDate = purchaseDate,
        warrantyEndDate = warrantyEndDate,
        notes = notes?.trim()?.takeIf { it.isNotEmpty() },
        isActive = isActive
    )
}

private fun DeviceMaintenanceRowDto.toMaintenanceRecord(
    performedByName: String?
): DeviceMaintenanceRecord {
    return DeviceMaintenanceRecord(
        id = id,
        deviceId = deviceId,
        description = description.trim(),
        performedAt = performedAt,
        performedByName = performedByName,
        cost = cost
            ?.takeIf { it > 0.0 }
            ?.let(::formatMaintenanceCost)
    )
}

@Serializable
private data class DeviceRowDto(
    val id: String,
    @SerialName("asset_tag")
    val assetTag: String,
    @SerialName("device_type")
    val deviceType: String,
    val brand: String,
    val model: String,
    val status: String,
    @SerialName("department_id")
    val departmentId: String? = null,
    @SerialName("assigned_user_id")
    val assignedUserId: String? = null,
    @SerialName("is_active")
    val isActive: Boolean = true
)

@Serializable
private data class DeviceDetailRowDto(
    val id: String,
    @SerialName("asset_tag")
    val assetTag: String,
    @SerialName("qr_token")
    val qrToken: String? = null,
    @SerialName("device_type")
    val deviceType: String,
    val brand: String,
    val model: String,
    @SerialName("serial_number")
    val serialNumber: String? = null,
    val status: String,
    @SerialName("department_id")
    val departmentId: String? = null,
    @SerialName("assigned_user_id")
    val assignedUserId: String? = null,
    @SerialName("purchase_date")
    val purchaseDate: String? = null,
    @SerialName("warranty_end_date")
    val warrantyEndDate: String? = null,
    val notes: String? = null,
    @SerialName("is_active")
    val isActive: Boolean = true
)

@Serializable
private data class DeviceMaintenanceRowDto(
    val id: String,
    @SerialName("device_id")
    val deviceId: String,
    val description: String,
    @SerialName("performed_by")
    val performedBy: String,
    @SerialName("performed_at")
    val performedAt: String? = null,
    val cost: Double? = null
)

@Serializable
private data class DepartmentNameDto(
    val id: String,
    val name: String
)

@Serializable
private data class ProfileNameDto(
    val id: String,
    @SerialName("full_name")
    val fullName: String? = null
)

private fun formatMaintenanceCost(value: Double): String {
    return NumberFormat.getCurrencyInstance(Locale.forLanguageTag("tr-TR")).apply {
        currency = Currency.getInstance("TRY")
        minimumFractionDigits = 2
        maximumFractionDigits = 2
    }.format(value)
}
