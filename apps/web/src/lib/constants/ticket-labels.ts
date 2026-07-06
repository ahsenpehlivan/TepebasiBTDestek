import type { TicketCategory, TicketPriority, TicketStatus } from "@/types/domain";

export const ticketStatusLabels: Record<TicketStatus, string> = {
  open: "Açık",
  assigned: "Atandı",
  in_progress: "İşlemde",
  waiting_user: "Kullanıcı Bekleniyor",
  resolved: "Çözüldü",
  closed: "Kapandı",
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
  printer_scanner: "Yazıcı / Tarayıcı",
  email_account: "E-posta / Hesap",
  access_request: "Erişim Talebi",
  other: "Diğer",
};
