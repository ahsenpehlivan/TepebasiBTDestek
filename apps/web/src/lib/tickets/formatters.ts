import {
  ticketCategoryLabels,
  ticketPriorityLabels,
  ticketStatusLabels,
} from "@/lib/constants/ticket-labels";
import type { TicketCategory, TicketPriority, TicketStatus } from "@/types/domain";

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("tr-TR", options).format(new Date(value));
}

export function formatTicketDateTime(value: string) {
  return formatDate(value, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatTicketDate(value: string) {
  return formatDate(value, {
    dateStyle: "medium",
  });
}

export function getTicketStatusLabel(status: TicketStatus) {
  return ticketStatusLabels[status];
}

export function getTicketPriorityLabel(priority: TicketPriority) {
  return ticketPriorityLabels[priority];
}

export function getTicketCategoryLabel(category: TicketCategory) {
  return ticketCategoryLabels[category];
}

export function normalizeSearchText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}
