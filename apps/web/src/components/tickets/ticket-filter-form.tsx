import Link from "next/link";

import {
  ticketCategoryLabels,
  ticketCategoryOptions,
  ticketPriorityLabels,
  ticketPriorityOptions,
  ticketStatusLabels,
  ticketStatusOptions,
} from "@/lib/constants/ticket-labels";
import type { TicketListFilters } from "@/lib/tickets/queries";

import styles from "./ticket-filter-form.module.css";

type TicketFilterFormProps = {
  filters: TicketListFilters;
};

export function TicketFilterForm({ filters }: TicketFilterFormProps) {
  return (
    <form className={styles.form} action="/tickets">
      <div className={styles.fieldGroup}>
        <label className={styles.field}>
          <span>Arama</span>
            <input
              type="search"
              name="q"
              defaultValue={filters.query}
              placeholder="Talep başlığı veya talep numarası"
            />
          </label>

          <label className={styles.field}>
            <span>Durum</span>
            <select name="status" defaultValue={filters.status}>
              <option value="all">Tüm durumlar</option>
              {ticketStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {ticketStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Öncelik</span>
            <select name="priority" defaultValue={filters.priority}>
              <option value="all">Tüm öncelikler</option>
              {ticketPriorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {ticketPriorityLabels[priority]}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Kategori</span>
            <select name="category" defaultValue={filters.category}>
              <option value="all">Tüm kategoriler</option>
            {ticketCategoryOptions.map((category) => (
              <option key={category} value={category}>
                {ticketCategoryLabels[category]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.primaryButton}>
          Filtrele
        </button>
        <Link href="/tickets" className={styles.secondaryButton}>
          Temizle
        </Link>
      </div>
    </form>
  );
}
