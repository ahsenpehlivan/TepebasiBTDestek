import "server-only";

import { createClient } from "@/lib/supabase/server";
import { normalizeSearchText } from "@/lib/devices/formatters";
import type {
  AppRole,
  DepartmentRecord,
  DeviceDetailRecord,
  DeviceFormRecord,
  DeviceListItem,
  DeviceMaintenanceItem,
  DeviceRelatedTicketItem,
  DeviceStatus,
  DeviceType,
  DeviceUserOption,
  MaintenanceType,
  TicketPriority,
  TicketStatus,
} from "@/types/domain";

const DEFAULT_DEVICE_LIST_LIMIT = 30;

type FilterValue<T extends string> = T | "all";

type DepartmentSummaryRow = Pick<DepartmentRecord, "id" | "name" | "code">;

type ProfileSummaryRow = {
  id: string;
  full_name: string;
  role?: AppRole;
  is_active?: boolean;
};

type DeviceRow = {
  id: string;
  asset_tag: string;
  qr_token: string;
  device_type: DeviceType;
  brand: string;
  model: string;
  serial_number: string | null;
  department_id: string | null;
  assigned_user_id: string | null;
  status: DeviceStatus;
  purchase_date: string | null;
  warranty_end_date: string | null;
  operating_system: string | null;
  notes: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type DeviceListRow = Pick<
  DeviceRow,
  | "id"
  | "asset_tag"
  | "device_type"
  | "brand"
  | "model"
  | "department_id"
  | "assigned_user_id"
  | "status"
  | "warranty_end_date"
  | "is_active"
  | "created_at"
>;

type TicketSummaryRow = {
  id: string;
  ticket_number: number | string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
};

type MaintenanceRow = {
  id: string;
  device_id: string;
  ticket_id: string | null;
  maintenance_type: MaintenanceType;
  description: string;
  performed_by: string;
  performed_at: string;
  cost: number | string;
  parts_used: string | null;
};

export type DeviceListFilters = {
  query: string;
  deviceType: FilterValue<DeviceType>;
  status: FilterValue<DeviceStatus>;
  departmentId: string | "all";
  limit: number;
};

export type DeviceListResult = {
  devices: DeviceListItem[];
  hasError: boolean;
  limit: number;
};

export type DeviceEditorOptions = {
  departments: DepartmentSummaryRow[];
  assignees: DeviceUserOption[];
};

export type DeviceDetailResult = {
  device: DeviceDetailRecord | null;
  relatedTickets: DeviceRelatedTicketItem[];
  maintenanceRecords: DeviceMaintenanceItem[];
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

export function parseDeviceListFilters(
  searchParams:
    | Record<string, string | string[] | undefined>
    | undefined,
): DeviceListFilters {
  return {
    query: normalizeSearchText(readSingleParam(searchParams?.q)),
    deviceType: readFilterValue(searchParams?.type, [
      "desktop",
      "laptop",
      "monitor",
      "printer",
      "scanner",
      "network_device",
      "tablet",
      "phone",
      "other",
    ]),
    status: readFilterValue(searchParams?.status, [
      "active",
      "in_repair",
      "spare",
      "retired",
      "lost",
    ]),
    departmentId: readSingleParam(searchParams?.department, "all") || "all",
    limit: DEFAULT_DEVICE_LIST_LIMIT,
  };
}

async function getProfileSummaryMap(ids: string[]) {
  if (ids.length === 0) {
    return new Map<string, ProfileSummaryRow>();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .in("id", ids)
    .returns<ProfileSummaryRow[]>();

  return new Map((data ?? []).map((profile) => [profile.id, profile]));
}

async function getDepartmentSummaryMap(ids: string[]) {
  if (ids.length === 0) {
    return new Map<string, DepartmentSummaryRow>();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("id, name, code")
    .in("id", ids)
    .returns<DepartmentSummaryRow[]>();

  return new Map((data ?? []).map((department) => [department.id, department]));
}

export async function loadDeviceList(
  filters: DeviceListFilters,
): Promise<DeviceListResult> {
  const supabase = await createClient();
  let query = supabase
    .from("devices")
    .select(
      "id, asset_tag, device_type, brand, model, department_id, assigned_user_id, status, warranty_end_date, is_active, created_at",
    )
    .order("asset_tag", { ascending: true })
    .limit(filters.limit);

  if (filters.deviceType !== "all") {
    query = query.eq("device_type", filters.deviceType);
  }

  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.departmentId !== "all") {
    query = query.eq("department_id", filters.departmentId);
  }

  if (filters.query) {
    query = query.or(
      [
        `asset_tag.ilike.%${filters.query}%`,
        `brand.ilike.%${filters.query}%`,
        `model.ilike.%${filters.query}%`,
      ].join(","),
    );
  }

  const { data, error } = await query;

  if (error) {
    return {
      devices: [],
      hasError: true,
      limit: filters.limit,
    };
  }

  const rows = (data ?? []) as DeviceListRow[];
  const departmentIds = Array.from(
    new Set(
      rows.flatMap((row) => (row.department_id ? [row.department_id] : [])),
    ),
  );
  const assignedUserIds = Array.from(
    new Set(
      rows.flatMap((row) => (row.assigned_user_id ? [row.assigned_user_id] : [])),
    ),
  );
  const [departmentMap, profileMap] = await Promise.all([
    getDepartmentSummaryMap(departmentIds),
    getProfileSummaryMap(assignedUserIds),
  ]);

  return {
    devices: rows.map((row) => ({
      id: row.id,
      assetTag: row.asset_tag,
      deviceType: row.device_type,
      brand: row.brand,
      model: row.model,
      departmentId: row.department_id,
      departmentName: row.department_id
        ? departmentMap.get(row.department_id)?.name ?? null
        : null,
      assignedUserId: row.assigned_user_id,
      assignedUserName: row.assigned_user_id
        ? profileMap.get(row.assigned_user_id)?.full_name ?? null
        : null,
      status: row.status,
      warrantyEndDate: row.warranty_end_date,
      isActive: row.is_active,
      createdAt: row.created_at,
    })),
    hasError: false,
    limit: filters.limit,
  };
}

export async function loadDeviceEditorOptions(): Promise<DeviceEditorOptions> {
  const supabase = await createClient();
  const [departmentResponse, assigneeResponse] = await Promise.all([
    loadActiveDepartments(),
    supabase
      .from("profiles")
      .select("id, full_name, role, is_active")
      .eq("is_active", true)
      .order("full_name", { ascending: true })
      .returns<ProfileSummaryRow[]>(),
  ]);

  return {
    departments: departmentResponse,
    assignees: (assigneeResponse.data ?? [])
      .filter((profile) => profile.role)
      .map((profile) => ({
        id: profile.id,
        fullName: profile.full_name,
        role: profile.role ?? "employee",
      })),
  };
}

export async function loadActiveDepartments() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("id, name, code")
    .eq("is_active", true)
    .order("name", { ascending: true })
    .returns<DepartmentSummaryRow[]>();

  return data ?? [];
}

function mapDeviceRowToFormRecord(row: DeviceRow): DeviceFormRecord {
  return {
    id: row.id,
    assetTag: row.asset_tag,
    deviceType: row.device_type,
    brand: row.brand,
    model: row.model,
    serialNumber: row.serial_number,
    departmentId: row.department_id,
    assignedUserId: row.assigned_user_id,
    status: row.status,
    purchaseDate: row.purchase_date,
    warrantyEndDate: row.warranty_end_date,
    operatingSystem: row.operating_system,
    notes: row.notes,
    isActive: row.is_active,
  };
}

export async function loadDeviceDetail(
  deviceId: string,
): Promise<DeviceDetailResult> {
  const supabase = await createClient();
  const { data: deviceRow, error: deviceError } = await supabase
    .from("devices")
    .select(
      [
        "id",
        "asset_tag",
        "qr_token",
        "device_type",
        "brand",
        "model",
        "serial_number",
        "department_id",
        "assigned_user_id",
        "status",
        "purchase_date",
        "warranty_end_date",
        "operating_system",
        "notes",
        "is_active",
        "created_by",
        "created_at",
        "updated_at",
      ].join(", "),
    )
    .eq("id", deviceId)
    .maybeSingle<DeviceRow>();

  if (deviceError) {
    return {
      device: null,
      relatedTickets: [],
      maintenanceRecords: [],
      hasError: true,
    };
  }

  if (!deviceRow) {
    return {
      device: null,
      relatedTickets: [],
      maintenanceRecords: [],
      hasError: false,
    };
  }

  const [ticketsResponse, maintenanceResponse] = await Promise.all([
    supabase
      .from("tickets")
      .select("id, ticket_number, title, status, priority, created_at")
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false })
      .limit(8)
      .returns<TicketSummaryRow[]>(),
    supabase
      .from("device_maintenance_records")
      .select(
        "id, device_id, ticket_id, maintenance_type, description, performed_by, performed_at, cost, parts_used",
      )
      .eq("device_id", deviceId)
      .order("performed_at", { ascending: false })
      .returns<MaintenanceRow[]>(),
  ]);

  const maintenanceRows = maintenanceResponse.data ?? [];
  const relatedTicketRows = ticketsResponse.data ?? [];
  const profileIds = Array.from(
    new Set(
      [
        ...(deviceRow.assigned_user_id ? [deviceRow.assigned_user_id] : []),
        ...(deviceRow.created_by ? [deviceRow.created_by] : []),
        ...maintenanceRows.map((row) => row.performed_by),
      ].filter(Boolean),
    ),
  ) as string[];
  const maintenanceTicketIds = Array.from(
    new Set(
      maintenanceRows.flatMap((row) => (row.ticket_id ? [row.ticket_id] : [])),
    ),
  );
  const departmentIds = Array.from(
    new Set(
      deviceRow.department_id ? [deviceRow.department_id] : [],
    ),
  );

  const [profileMap, departmentMap, maintenanceTicketResponse] = await Promise.all([
    getProfileSummaryMap(profileIds),
    getDepartmentSummaryMap(departmentIds),
    maintenanceTicketIds.length > 0
      ? supabase
          .from("tickets")
          .select("id, ticket_number, title, status, priority, created_at")
          .in("id", maintenanceTicketIds)
          .returns<TicketSummaryRow[]>()
      : Promise.resolve({ data: [] as TicketSummaryRow[] }),
  ]);

  const maintenanceTicketMap = new Map(
    (maintenanceTicketResponse.data ?? []).map((ticket) => [ticket.id, ticket]),
  );

  return {
    device: {
      ...mapDeviceRowToFormRecord(deviceRow),
      qrToken: deviceRow.qr_token,
      departmentName: deviceRow.department_id
        ? departmentMap.get(deviceRow.department_id)?.name ?? null
        : null,
      assignedUserName: deviceRow.assigned_user_id
        ? profileMap.get(deviceRow.assigned_user_id)?.full_name ?? null
        : null,
      createdByName: deviceRow.created_by
        ? profileMap.get(deviceRow.created_by)?.full_name ?? null
        : null,
      createdAt: deviceRow.created_at,
      updatedAt: deviceRow.updated_at,
    },
    relatedTickets: relatedTicketRows.map((ticket) => ({
      id: ticket.id,
      ticketNumber: String(ticket.ticket_number),
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.created_at,
    })),
    maintenanceRecords: maintenanceRows.map((record) => {
      const relatedTicket = record.ticket_id
        ? maintenanceTicketMap.get(record.ticket_id) ?? null
        : null;

      return {
        id: record.id,
        maintenanceType: record.maintenance_type,
        description: record.description,
        performedByName: profileMap.get(record.performed_by)?.full_name ?? null,
        performedAt: record.performed_at,
        cost: Number(record.cost ?? 0),
        partsUsed: record.parts_used,
        relatedTicket: relatedTicket
          ? {
              id: relatedTicket.id,
              ticketNumber: String(relatedTicket.ticket_number),
              title: relatedTicket.title,
              status: relatedTicket.status,
              priority: relatedTicket.priority,
              createdAt: relatedTicket.created_at,
            }
          : null,
      };
    }),
    hasError: false,
  };
}

export async function loadDeviceFormRecord(deviceId: string) {
  const { device, hasError } = await loadDeviceDetail(deviceId);

  if (hasError || !device) {
    return {
      device: null,
      hasError,
    };
  }

  return {
    device,
    hasError: false,
  };
}

export async function findDeviceIdByQrToken(token: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("devices")
    .select("id")
    .eq("qr_token", token)
    .maybeSingle<{ id: string }>();

  return data?.id ?? null;
}
