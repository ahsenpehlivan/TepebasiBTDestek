import type { TicketCategory, TicketPriority, TicketStatus } from "@/types/domain";

export const ticketStatusLabels: Record<TicketStatus, string> = {
  open: "Açık",
  assigned: "Atandı",
  in_progress: "İşlemde",
  waiting_user: "Kullanıcı Bekleniyor",
  resolved: "Çözüldü",
  closed: "Kapatıldı",
  cancelled: "İptal Edildi",
};

export const ticketPriorityLabels: Record<TicketPriority, string> = {
  low: "Düşük",
  normal: "Normal",
  high: "Yüksek",
  urgent: "Acil",
};

export const ticketCategoryLabels: Record<TicketCategory, string> = {
  hardware: "Donanım",
  software: "Yazılım",
  network: "Ağ",
  printer_scanner: "Yazıcı/Tarayıcı",
  email_account: "E-posta/Hesap",
  access_request: "Erişim Talebi",
  other: "Diğer",
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
