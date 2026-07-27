package com.ahsen.tepebasibtdestek.data.ticket

import com.ahsen.tepebasibtdestek.core.result.AppResult
import com.ahsen.tepebasibtdestek.data.remote.supabase.SupabaseClientProvider
import com.ahsen.tepebasibtdestek.domain.ticket.CreateTicketInput
import com.ahsen.tepebasibtdestek.domain.ticket.TicketCategory
import com.ahsen.tepebasibtdestek.domain.ticket.TicketComment
import com.ahsen.tepebasibtdestek.domain.ticket.TicketDetail
import com.ahsen.tepebasibtdestek.domain.ticket.TicketPriority
import com.ahsen.tepebasibtdestek.domain.ticket.TicketStatus
import com.ahsen.tepebasibtdestek.domain.ticket.TicketSummary
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

private const val DEFAULT_TICKET_LOAD_ERROR_MESSAGE =
    "Talepler yüklenemedi. Lütfen tekrar deneyin."
private const val DEFAULT_TICKET_DETAIL_ERROR_MESSAGE =
    "Talep detayı yüklenemedi. Lütfen tekrar deneyin."
private const val DEFAULT_TICKET_CREATE_ERROR_MESSAGE =
    "Talep oluşturulamadı. Lütfen tekrar deneyin."
private const val TICKET_NOT_FOUND_MESSAGE =
    "Talep bulunamadı veya bu talebe erişim izniniz yok."
private const val TICKET_CREATE_PROFILE_ERROR_MESSAGE =
    "Talep oluşturmak için profil bilgisi doğrulanamadı."

class SupabaseTicketRepository(
    private val clientProvider: SupabaseClientProvider
) : TicketRepository {
    override suspend fun loadMyTickets(): Result<List<TicketSummary>> {
        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> {
                return Result.failure(IllegalStateException(DEFAULT_TICKET_LOAD_ERROR_MESSAGE))
            }
        }

        return try {
            val ticketRows = client.postgrest
                .from("tickets")
                .select(
                    columns = Columns.list(
                        "id",
                        "ticket_number",
                        "title",
                        "description",
                        "status",
                        "priority",
                        "category",
                        "created_at",
                        "updated_at",
                        "device_id",
                        "assigned_to"
                    )
                ) {
                    order(column = "created_at", order = Order.DESCENDING)
                }
                .decodeList<TicketRowDto>()

            val deviceLabelMap = loadDeviceLabels(
                client = client,
                deviceIds = ticketRows.mapNotNull { it.deviceId }.distinct()
            )
            val assigneeNameMap = loadProfileNames(
                client = client,
                profileIds = ticketRows.mapNotNull { it.assignedTo }.distinct()
            )

            Result.success(
                ticketRows.mapNotNull { row ->
                    row.toSummary(
                        deviceLabel = row.deviceId?.let(deviceLabelMap::get),
                        assignedToName = row.assignedTo?.let(assigneeNameMap::get)
                    )
                }
            )
        } catch (_: Exception) {
            Result.failure(IllegalStateException(DEFAULT_TICKET_LOAD_ERROR_MESSAGE))
        }
    }

    override suspend fun loadTicketDetail(ticketId: String): Result<TicketDetail> {
        if (ticketId.isBlank()) {
            return Result.failure(IllegalStateException(TICKET_NOT_FOUND_MESSAGE))
        }

        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> {
                return Result.failure(IllegalStateException(DEFAULT_TICKET_DETAIL_ERROR_MESSAGE))
            }
        }

        return try {
            val row = client.postgrest
                .from("tickets")
                .select(
                    columns = Columns.list(
                        "id",
                        "ticket_number",
                        "title",
                        "description",
                        "status",
                        "priority",
                        "category",
                        "created_at",
                        "updated_at",
                        "device_id",
                        "assigned_to"
                    )
                ) {
                    filter {
                        eq("id", ticketId)
                    }
                }
                .decodeList<TicketRowDto>()
                .firstOrNull()
                ?: return Result.failure(IllegalStateException(TICKET_NOT_FOUND_MESSAGE))

            val deviceLabel = row.deviceId?.let { id ->
                loadDeviceLabels(client = client, deviceIds = listOf(id))[id]
            }
            val assignedToName = row.assignedTo?.let { id ->
                loadProfileNames(client = client, profileIds = listOf(id))[id]
            }
            val comments = loadTicketComments(client = client, ticketId = row.id)

            val detail = row.toDetail(
                deviceLabel = deviceLabel,
                assignedToName = assignedToName,
                comments = comments
            ) ?: return Result.failure(IllegalStateException(DEFAULT_TICKET_DETAIL_ERROR_MESSAGE))

            Result.success(detail)
        } catch (_: Exception) {
            Result.failure(IllegalStateException(DEFAULT_TICKET_DETAIL_ERROR_MESSAGE))
        }
    }

    override suspend fun createTicket(input: CreateTicketInput): Result<String> {
        val client = when (val result = clientProvider.getClient()) {
            is AppResult.Success -> result.value
            is AppResult.Failure -> {
                return Result.failure(IllegalStateException(DEFAULT_TICKET_CREATE_ERROR_MESSAGE))
            }
        }

        return try {
            val context = loadCurrentTicketContext(client)
                ?: return Result.failure(IllegalStateException(TICKET_CREATE_PROFILE_ERROR_MESSAGE))

            val payload = CreateTicketPayload(
                title = input.title.trim(),
                description = input.description.trim(),
                category = input.category.rawValue,
                priority = input.priority.rawValue,
                departmentId = context.departmentId,
                deviceId = input.deviceId?.trim()?.takeIf { it.isNotEmpty() }
            )

            client.postgrest
                .from("tickets")
                .insert(payload)

            val createdTicketId = findLatestCreatedTicketId(
                client = client,
                userId = context.userId,
                title = payload.title,
                description = payload.description
            )

            Result.success(createdTicketId)
        } catch (_: Exception) {
            Result.failure(IllegalStateException(DEFAULT_TICKET_CREATE_ERROR_MESSAGE))
        }
    }
}

private suspend fun loadCurrentTicketContext(
    client: SupabaseClient
): CurrentTicketContext? {
    client.auth.awaitInitialization()
    val currentUser = client.auth.currentSessionOrNull()?.user ?: return null

    return try {
        client.postgrest
            .from("profiles")
            .select(columns = Columns.list("department_id")) {
                filter {
                    eq("id", currentUser.id)
                }
            }
            .decodeList<ProfileDepartmentDto>()
            .firstOrNull()
            ?.departmentId
            ?.let { departmentId ->
                CurrentTicketContext(
                    userId = currentUser.id,
                    departmentId = departmentId
                )
            }
    } catch (_: Exception) {
        null
    }
}

private suspend fun findLatestCreatedTicketId(
    client: SupabaseClient,
    userId: String,
    title: String,
    description: String
): String {
    return try {
        client.postgrest
            .from("tickets")
            .select(columns = Columns.list("id")) {
                filter {
                    eq("created_by", userId)
                    eq("title", title)
                    eq("description", description)
                }
                order(column = "created_at", order = Order.DESCENDING)
            }
            .decodeList<CreatedTicketLookupDto>()
            .firstOrNull()
            ?.id
            .orEmpty()
    } catch (_: Exception) {
        ""
    }
}

private suspend fun loadDeviceLabels(
    client: SupabaseClient,
    deviceIds: List<String>
): Map<String, String> {
    if (deviceIds.isEmpty()) {
        return emptyMap()
    }

    return try {
        client.postgrest
            .from("devices")
            .select(
                columns = Columns.list("id", "asset_tag", "brand", "model")
            ) {
                filter {
                    isIn("id", deviceIds)
                }
            }
            .decodeList<DeviceSummaryDto>()
            .associate { device ->
                device.id to buildDeviceLabel(device.assetTag, device.brand, device.model)
            }
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
            .select(
                columns = Columns.list("id", "full_name")
            ) {
                filter {
                    isIn("id", profileIds)
                }
            }
            .decodeList<ProfileNameDto>()
            .associateNotNull { profile ->
                val fullName = profile.fullName?.trim()?.takeIf { it.isNotEmpty() } ?: return@associateNotNull null
                profile.id to fullName
            }
    } catch (_: Exception) {
        emptyMap()
    }
}

private suspend fun loadTicketComments(
    client: SupabaseClient,
    ticketId: String
): List<TicketComment> {
    return try {
        val commentRows = client.postgrest
            .from("ticket_comments")
            .select(
                columns = Columns.list("id", "author_id", "content", "is_internal", "created_at")
            ) {
                filter {
                    eq("ticket_id", ticketId)
                }
                order(column = "created_at", order = Order.ASCENDING)
            }
            .decodeList<TicketCommentDto>()

        val authorNames = loadProfileNames(
            client = client,
            profileIds = commentRows.map { it.authorId }.distinct()
        )

        commentRows.map { comment ->
            TicketComment(
                id = comment.id,
                authorName = authorNames[comment.authorId],
                content = comment.content.trim(),
                isInternal = comment.isInternal,
                createdAt = comment.createdAt
            )
        }
    } catch (_: Exception) {
        emptyList()
    }
}

private fun TicketRowDto.toSummary(
    deviceLabel: String?,
    assignedToName: String?
): TicketSummary? {
    val mappedStatus = TicketStatus.fromRawValue(status) ?: return null
    val mappedPriority = TicketPriority.fromRawValue(priority) ?: return null
    val mappedCategory = TicketCategory.fromRawValue(category) ?: return null

    return TicketSummary(
        id = id,
        ticketNumber = ticketNumber?.toString()?.takeIf { it.isNotBlank() } ?: id.take(8),
        title = title.trim(),
        descriptionSummary = description.toSummary(),
        status = mappedStatus,
        priority = mappedPriority,
        category = mappedCategory,
        createdAt = createdAt,
        updatedAt = updatedAt ?: createdAt,
        deviceLabel = deviceLabel,
        assignedToName = assignedToName
    )
}

private fun TicketRowDto.toDetail(
    deviceLabel: String?,
    assignedToName: String?,
    comments: List<TicketComment>
): TicketDetail? {
    val mappedStatus = TicketStatus.fromRawValue(status) ?: return null
    val mappedPriority = TicketPriority.fromRawValue(priority) ?: return null
    val mappedCategory = TicketCategory.fromRawValue(category) ?: return null

    return TicketDetail(
        id = id,
        ticketNumber = ticketNumber?.toString()?.takeIf { it.isNotBlank() } ?: id.take(8),
        title = title.trim(),
        description = description.trim(),
        status = mappedStatus,
        priority = mappedPriority,
        category = mappedCategory,
        createdAt = createdAt,
        updatedAt = updatedAt ?: createdAt,
        deviceLabel = deviceLabel,
        assignedToName = assignedToName,
        comments = comments
    )
}

private fun String.toSummary(maxLength: Int = 140): String {
    val singleLine = trim().replace(Regex("\\s+"), " ")
    if (singleLine.length <= maxLength) {
        return singleLine
    }

    return singleLine.take(maxLength - 1).trimEnd() + "…"
}

private fun buildDeviceLabel(
    assetTag: String,
    brand: String,
    model: String
): String {
    return listOf(assetTag.trim(), brand.trim(), model.trim())
        .filter { it.isNotEmpty() }
        .joinToString(" • ")
}

private inline fun <T, K, V> Iterable<T>.associateNotNull(transform: (T) -> Pair<K, V>?) =
    buildMap<K, V> {
        for (item in this@associateNotNull) {
            val pair = transform(item) ?: continue
            put(pair.first, pair.second)
        }
    }

@Serializable
private data class TicketRowDto(
    val id: String,
    @SerialName("ticket_number")
    val ticketNumber: Long? = null,
    val title: String,
    val description: String,
    val status: String,
    val priority: String,
    val category: String,
    @SerialName("created_at")
    val createdAt: String,
    @SerialName("updated_at")
    val updatedAt: String? = null,
    @SerialName("device_id")
    val deviceId: String? = null,
    @SerialName("assigned_to")
    val assignedTo: String? = null
)

@Serializable
private data class DeviceSummaryDto(
    val id: String,
    @SerialName("asset_tag")
    val assetTag: String,
    val brand: String,
    val model: String
)

@Serializable
private data class ProfileNameDto(
    val id: String,
    @SerialName("full_name")
    val fullName: String? = null
)

@Serializable
private data class ProfileDepartmentDto(
    @SerialName("department_id")
    val departmentId: String? = null
)

@Serializable
private data class TicketCommentDto(
    val id: String,
    @SerialName("author_id")
    val authorId: String,
    val content: String,
    @SerialName("is_internal")
    val isInternal: Boolean = false,
    @SerialName("created_at")
    val createdAt: String
)

@Serializable
private data class CreateTicketPayload(
    val title: String,
    val description: String,
    val category: String,
    val priority: String,
    @SerialName("department_id")
    val departmentId: String,
    @SerialName("device_id")
    val deviceId: String? = null
)

@Serializable
private data class CreatedTicketLookupDto(
    val id: String
)

private data class CurrentTicketContext(
    val userId: String,
    val departmentId: String
)
