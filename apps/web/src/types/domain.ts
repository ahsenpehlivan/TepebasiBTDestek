export type AppRole = "employee" | "technician" | "admin";

export type AuthStateStatus =
  | "anonymous"
  | "missing_profile"
  | "inactive"
  | "authenticated";

export type TicketStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "waiting_user"
  | "resolved"
  | "closed"
  | "cancelled";

export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type TicketCategory =
  | "hardware"
  | "software"
  | "network"
  | "printer_scanner"
  | "email_account"
  | "access_request"
  | "other";

export type DeviceType =
  | "desktop"
  | "laptop"
  | "monitor"
  | "printer"
  | "scanner"
  | "network_device"
  | "tablet"
  | "phone"
  | "other";

export type DeviceStatus = "active" | "in_repair" | "spare" | "retired" | "lost";

export type MaintenanceType =
  | "inspection"
  | "repair"
  | "upgrade"
  | "component_replacement"
  | "software_installation"
  | "other";

export type DepartmentRecord = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProfileRecord = {
  id: string;
  fullName: string;
  role: AppRole;
  departmentId: string | null;
  phoneExtension: string | null;
  jobTitle: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthenticatedProfile = {
  id: string;
  email: string | null;
  fullName: string;
  role: AppRole;
  departmentId: string | null;
  departmentName: string | null;
  departmentCode: string | null;
  jobTitle: string | null;
  isActive: boolean;
};

export type AuthState = {
  status: AuthStateStatus;
  userId: string | null;
  email: string | null;
  profile: AuthenticatedProfile | null;
};

export type DeviceRecord = {
  id: string;
  assetTag: string;
  qrToken: string;
  deviceType: DeviceType;
  departmentId: string | null;
  assignedUserId: string | null;
  status: DeviceStatus;
  createdAt: string;
  updatedAt: string;
};

export type TicketRecord = {
  id: string;
  ticketNumber: number;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  departmentId: string;
  deviceId: string | null;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TicketListItem = {
  id: string;
  ticketNumber: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  assignedTechnicianName: string | null;
};
