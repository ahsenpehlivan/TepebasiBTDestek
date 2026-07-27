import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { StatItem } from "@/types/dashboard";
import type {
  AppRole,
  DepartmentRecord,
  DeviceStatus,
  DeviceType,
  TicketAssigneeOption,
  TicketCategory,
  TicketCommentItem,
  TicketDetailRecord,
  TicketDeviceSummary,
  TicketListItem,
  TicketPriority,
  TicketStatus,
  TicketStatusHistoryItem,
} from "@/types/domain";

const DEFAULT_TICKET_LIST_LIMIT = 25;

type FilterValue<T extends string> = T | "all";

type TicketRow = {
  id: string;
  ticket_number: number | string;
  title: string;
  description?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  department_id: string;
  device_id?: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at?: string;
  assigned_at?: string | null;
  due_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
};

type ProfileSummaryRow = {
  id: string;
  full_name: string;
  role?: AppRole;
  is_active?: boolean;
};

type DepartmentSummaryRow = Pick<DepartmentRecord, "id" | "name" | "code">;

type DeviceSummaryRow = {
  id: string;
  asset_tag: string;
  brand: string;
  model: string;
  device_type: DeviceType;
  status: DeviceStatus;
  notes: string | null;
};

type TicketCommentRow = {
  id: string;
  ticket_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
};

type TicketStatusHistoryRow = {
  id: string;
  ticket_id: string;
  old_status: TicketStatus | null;
  new_status: TicketStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
};

type CountResult = {
  count: number | null;
  hasError: boolean;
};

export type TicketListFilters = {
  query: string;
  status: FilterValue<TicketStatus>;
  priority: FilterValue<TicketPriority>;
  category: FilterValue<TicketCategory>;
  limit: number;
};

export type TicketListResult = {
  tickets: TicketListItem[];
  hasError: boolean;
  limit: number;
};

export type TicketDetailResult = {
  ticket: TicketDetailRecord | null;
  comments: TicketCommentItem[];
  history: TicketStatusHistoryItem[];
  assignees: TicketAssigneeOption[];
  hasError: boolean;
};

function readSingleParam(
  value: string | string[] | undefined,
  fallback = "",
) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function readFilterValue<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
): FilterValue<T> {
  const resolved = readSingleParam(value, "all");
  return allowed.includes(resolved as T) ? (resolved as T) : "all";
}

export function parseTicketListFilters(
  searchParams:
    | Record<string, string | string[] | undefined>
    | undefined,
): TicketListFilters {
  return {
    query: readSingleParam(searchParams?.q).trim(),
    status: readFilterValue(searchParams?.status, [
      "open",
      "assigned",
      "in_progress",
      "waiting_user",
      "resolved",
      "closed",
      "cancelled",
    ]),
    priority: readFilterValue(searchParams?.priority, [
      "low",
      "normal",
      "high",
      "urgent",
    ]),
    category: readFilterValue(searchParams?.category, [
      "hardware",
      "software",
      "network",
      "printer_scanner",
      "email_account",
      "access_request",
      "other",
    ]),
    limit: DEFAULT_TICKET_LIST_LIMIT,
  };
}

async function getProfileNameMap(ids: string[]) {
  if (ids.length === 0) {
    return new Map<string, string>();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", ids)
    .returns<ProfileSummaryRow[]>();

  return new Map((data ?? []).map((profile) => [profile.id, profile.full_name]));
}

async function getDepartmentNameMap(ids: string[]) {
  if (ids.length === 0) {
    return new Map<string, string>();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("id, name, code")
    .in("id", ids)
    .returns<DepartmentSummaryRow[]>();

  return new Map((data ?? []).map((department) => [department.id, department.name]));
}

export async function loadTicketList(
  filters: TicketListFilters,
): Promise<TicketListResult> {
  const supabase = await createClient();
  let query = supabase
    .from("tickets")
    .select(
      "id, ticket_number, title, category, priority, status, created_at, assigned_to, created_by, department_id",
    )
    .order("created_at", { ascending: false })
    .limit(filters.limit);

  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.priority !== "all") {
    query = query.eq("priority", filters.priority);
  }

  if (filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.query) {
    if (/^\d+$/.test(filters.query)) {
      query = query.eq("ticket_number", Number(filters.query));
    } else {
      query = query.ilike("title", `%${filters.query}%`);
    }
  }

  const { data, error } = await query;

  if (error) {
    return {
      tickets: [],
      hasError: true,
      limit: filters.limit,
    };
  }

  const rows = (data ?? []) as TicketRow[];
  const relatedProfileIds = Array.from(
    new Set(
      rows.flatMap((row) => [
        row.created_by,
        ...(row.assigned_to ? [row.assigned_to] : []),
      ]),
    ),
  );
  const departmentIds = Array.from(
    new Set(rows.map((row) => row.department_id)),
  );

  const [profileNameMap, departmentNameMap] = await Promise.all([
    getProfileNameMap(relatedProfileIds),
    getDepartmentNameMap(departmentIds),
  ]);

  return {
    tickets: rows.map((row) => ({
      id: row.id,
      ticketNumber: String(row.ticket_number),
      title: row.title,
      category: row.category,
      priority: row.priority,
      status: row.status,
      createdAt: row.created_at,
      assignedTechnicianName: row.assigned_to
        ? profileNameMap.get(row.assigned_to) ?? null
        : null,
      createdByName: profileNameMap.get(row.created_by) ?? null,
      departmentId: row.department_id,
      departmentName: departmentNameMap.get(row.department_id) ?? null,
    })),
    hasError: false,
    limit: filters.limit,
  };
}

export async function loadTicketDetail(
  ticketId: string,
): Promise<TicketDetailResult> {
  const supabase = await createClient();
  const { data: ticketRow, error: ticketError } = await supabase
    .from("tickets")
    .select(
      [
        "id",
        "ticket_number",
        "title",
        "description",
        "category",
        "priority",
        "status",
        "department_id",
        "device_id",
        "created_by",
        "assigned_to",
        "created_at",
        "updated_at",
        "assigned_at",
        "due_at",
        "resolved_at",
        "closed_at",
      ].join(", "),
    )
    .eq("id", ticketId)
    .maybeSingle<TicketRow>();

  if (ticketError) {
    return {
      ticket: null,
      comments: [],
      history: [],
      assignees: [],
      hasError: true,
    };
  }

  if (!ticketRow) {
    return {
      ticket: null,
      comments: [],
      history: [],
      assignees: [],
      hasError: false,
    };
  }

  const { data: commentsData } = await supabase
    .from("ticket_comments")
    .select("id, ticket_id, author_id, content, is_internal, created_at")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true })
    .returns<TicketCommentRow[]>();

  const { data: historyData } = await supabase
    .from("ticket_status_history")
    .select("id, ticket_id, old_status, new_status, changed_by, note, created_at")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true })
    .returns<TicketStatusHistoryRow[]>();

  const { data: departmentData } = await supabase
    .from("departments")
    .select("id, name, code")
    .eq("id", ticketRow.department_id)
    .maybeSingle<DepartmentSummaryRow>();

  let device: TicketDeviceSummary | null = null;

  if (ticketRow.device_id) {
    const { data: deviceData } = await supabase
      .from("devices")
      .select("id, asset_tag, brand, model, device_type, status, notes")
      .eq("id", ticketRow.device_id)
      .maybeSingle<DeviceSummaryRow>();

    device = deviceData
      ? {
          id: deviceData.id,
          assetTag: deviceData.asset_tag,
          brand: deviceData.brand,
          model: deviceData.model,
          deviceType: deviceData.device_type,
          status: deviceData.status,
          notes: deviceData.notes,
        }
      : null;
  }

  const assigneeProfileIds = Array.from(
    new Set([
      ticketRow.created_by,
      ...(ticketRow.assigned_to ? [ticketRow.assigned_to] : []),
      ...((commentsData ?? []).map((comment) => comment.author_id)),
      ...((historyData ?? [])
        .flatMap((history) => (history.changed_by ? [history.changed_by] : []))),
    ]),
  );

  const [profileNameMap, assigneeRows] = await Promise.all([
    getProfileNameMap(assigneeProfileIds),
    supabase
      .from("profiles")
      .select("id, full_name, role, is_active")
      .eq("is_active", true)
      .in("role", ["technician", "admin"])
      .order("full_name", { ascending: true })
      .returns<ProfileSummaryRow[]>(),
  ]);

  return {
    ticket: {
      id: ticketRow.id,
      ticketNumber: String(ticketRow.ticket_number),
      title: ticketRow.title,
      description: ticketRow.description ?? "",
      category: ticketRow.category,
      priority: ticketRow.priority,
      status: ticketRow.status,
      departmentId: ticketRow.department_id,
      departmentName: departmentData?.name ?? null,
      createdById: ticketRow.created_by,
      createdByName: profileNameMap.get(ticketRow.created_by) ?? null,
      assignedToId: ticketRow.assigned_to,
      assignedToName: ticketRow.assigned_to
        ? profileNameMap.get(ticketRow.assigned_to) ?? null
        : null,
      device,
      createdAt: ticketRow.created_at,
      updatedAt: ticketRow.updated_at ?? ticketRow.created_at,
      assignedAt: ticketRow.assigned_at ?? null,
      dueAt: ticketRow.due_at ?? null,
      resolvedAt: ticketRow.resolved_at ?? null,
      closedAt: ticketRow.closed_at ?? null,
    },
    comments: (commentsData ?? []).map((comment) => ({
      id: comment.id,
      authorName: profileNameMap.get(comment.author_id) ?? null,
      content: comment.content,
      isInternal: comment.is_internal,
      createdAt: comment.created_at,
    })),
    history: (historyData ?? []).map((history) => ({
      id: history.id,
      oldStatus: history.old_status,
      newStatus: history.new_status,
      changedByName: history.changed_by
        ? profileNameMap.get(history.changed_by) ?? null
        : null,
      note: history.note,
      createdAt: history.created_at,
    })),
    assignees: (assigneeRows.data ?? []).map((profile) => ({
      id: profile.id,
      fullName: profile.full_name,
      role: profile.role ?? "technician",
    })),
    hasError: false,
  };
}

async function getTableCount(
  table: "tickets" | "devices",
  status?: TicketStatus,
): Promise<CountResult> {
  const supabase = await createClient();
  let query = supabase.from(table).select("id", {
    count: "exact",
    head: true,
  });

  if (table === "tickets" && status) {
    query = query.eq("status", status);
  }

  const { count, error } = await query;

  return {
    count,
    hasError: Boolean(error),
  };
}

export async function loadDashboardStats(): Promise<StatItem[]> {
  const [total, open, inProgress, resolved, devices] = await Promise.all([
    getTableCount("tickets"),
    getTableCount("tickets", "open"),
    getTableCount("tickets", "in_progress"),
    getTableCount("tickets", "resolved"),
    getTableCount("devices"),
  ]);

  const hasError =
    total.hasError ||
    open.hasError ||
    inProgress.hasError ||
    resolved.hasError ||
    devices.hasError;

  if (hasError) {
    return [
      {
        label: "Toplam Ticket",
        value: "-",
        detail: "Veri alinamadi.",
        tone: "neutral",
      },
      {
        label: "Acik",
        value: "-",
        detail: "Veri alinamadi.",
        tone: "warning",
      },
      {
        label: "İşlemde",
        value: "-",
        detail: "Veri alinamadi.",
        tone: "accent",
      },
      {
        label: "Çözüldü",
        value: "-",
        detail: "Veri alinamadi.",
        tone: "success",
      },
      {
        label: "Kayitli Cihaz",
        value: "-",
        detail: "Veri alinamadi.",
        tone: "neutral",
      },
    ];
  }

  return [
    {
      label: "Toplam Ticket",
      value: String(total.count ?? 0),
      detail: "Veritabanındaki toplam teknik destek kaydı.",
      tone: "neutral",
    },
    {
      label: "Acik",
      value: String(open.count ?? 0),
      detail: "Henüz atama veya işlem bekleyen kayıtlar.",
      tone: "warning",
    },
    {
      label: "İşlemde",
      value: String(inProgress.count ?? 0),
      detail: "Teknik ekip tarafından üzerinde çalışılan kayıtlar.",
      tone: "accent",
    },
    {
      label: "Çözüldü",
      value: String(resolved.count ?? 0),
      detail: "Resolved durumuna geçen kayıtlar.",
      tone: "success",
    },
    {
      label: "Kayitli Cihaz",
      value: String(devices.count ?? 0),
      detail: "Envanterde bulunan toplam cihaz kaydı.",
      tone: "neutral",
    },
  ];
}
