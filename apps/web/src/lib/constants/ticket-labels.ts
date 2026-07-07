import type { TicketCategory, TicketPriority, TicketStatus } from "@/types/domain";

export const ticketStatusLabels: Record<TicketStatus, string> = {
  open: "Acik",
  assigned: "Atandi",
  in_progress: "Islemde",
  waiting_user: "Kullanici Bekleniyor",
  resolved: "Cozuldu",
  closed: "Kapandi",
  cancelled: "Iptal Edildi",
};

export const ticketPriorityLabels: Record<TicketPriority, string> = {
  low: "Dusuk",
  normal: "Normal",
  high: "Yuksek",
  urgent: "Acil",
};

export const ticketCategoryLabels: Record<TicketCategory, string> = {
  hardware: "Donanim",
  software: "Yazilim",
  network: "Ag",
  printer_scanner: "Yazici / Tarayici",
  email_account: "E-posta / Hesap",
  access_request: "Erisim Talebi",
  other: "Diger",
};

export const ticketStatusOptions: TicketStatus[] = [
  "open",
  "assigned",
  "in_progress",
  "waiting_user",
  "resolved",
  "closed",
  "cancelled",
];

export const ticketFinalStatuses: TicketStatus[] = ["closed", "cancelled"];

export const ticketStatusesRequiringAssignee: TicketStatus[] = [
  "assigned",
  "in_progress",
  "waiting_user",
  "resolved",
  "closed",
];

export const ticketStatusTransitionMap: Record<TicketStatus, TicketStatus[]> = {
  open: ["assigned", "cancelled"],
  assigned: ["in_progress", "waiting_user", "cancelled"],
  in_progress: ["waiting_user", "resolved", "cancelled"],
  waiting_user: ["in_progress", "resolved", "cancelled"],
  resolved: ["closed"],
  closed: [],
  cancelled: [],
};

export function getAvailableTicketTransitions(
  currentStatus: TicketStatus,
  hasAssignee: boolean,
) {
  const nextStatuses = ticketStatusTransitionMap[currentStatus];

  if (hasAssignee) {
    return nextStatuses;
  }

  return nextStatuses.filter(
    (status) => !ticketStatusesRequiringAssignee.includes(status),
  );
}

export const ticketPriorityOptions: TicketPriority[] = [
  "low",
  "normal",
  "high",
  "urgent",
];

export const ticketCategoryOptions: TicketCategory[] = [
  "hardware",
  "software",
  "network",
  "printer_scanner",
  "email_account",
  "access_request",
  "other",
];
