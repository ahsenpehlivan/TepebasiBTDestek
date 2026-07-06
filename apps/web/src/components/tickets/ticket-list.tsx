import Link from "next/link";

import {
  getTicketCategoryLabel,
  formatTicketDateTime,
  getTicketPriorityLabel,
  getTicketStatusLabel,
} from "@/lib/tickets/formatters";
import type { TicketListItem } from "@/types/domain";

import styles from "./ticket-list.module.css";

type TicketListProps = {
  tickets: TicketListItem[];
};

function TicketStatusBadge({ status }: { status: TicketListItem["status"] }) {
  return (
    <span className={styles.badge} data-kind="status" data-value={status}>
      {getTicketStatusLabel(status)}
    </span>
  );
}

function TicketPriorityBadge({ priority }: { priority: TicketListItem["priority"] }) {
  return (
    <span className={styles.badge} data-kind="priority" data-value={priority}>
      {getTicketPriorityLabel(priority)}
    </span>
  );
}

export function TicketList({ tickets }: TicketListProps) {
  return (
    <>
      <section className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ticket No</th>
                <th>Baslik</th>
                <th>Kategori</th>
                <th>Oncelik</th>
                <th>Durum</th>
                <th>Olusturan</th>
                <th>Birim</th>
                <th>Atanan</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>#{ticket.ticketNumber}</td>
                  <td>
                    <Link href={`/tickets/${ticket.id}`} className={styles.titleLink}>
                      {ticket.title}
                    </Link>
                  </td>
                  <td>{getTicketCategoryLabel(ticket.category)}</td>
                  <td>
                    <TicketPriorityBadge priority={ticket.priority} />
                  </td>
                  <td>
                    <TicketStatusBadge status={ticket.status} />
                  </td>
                  <td>{ticket.createdByName ?? "Belirsiz"}</td>
                  <td>{ticket.departmentName ?? "Belirsiz"}</td>
                  <td>{ticket.assignedTechnicianName ?? "Atanmamis"}</td>
                  <td>{formatTicketDateTime(ticket.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.cardList}>
        {tickets.map((ticket) => (
          <article key={ticket.id} className={styles.ticketCard}>
            <div className={styles.cardHeader}>
              <span className={styles.ticketNumber}>#{ticket.ticketNumber}</span>
              <TicketStatusBadge status={ticket.status} />
            </div>

            <Link href={`/tickets/${ticket.id}`} className={styles.cardTitle}>
              {ticket.title}
            </Link>

            <div className={styles.cardMeta}>
              <span>{getTicketCategoryLabel(ticket.category)}</span>
              <TicketPriorityBadge priority={ticket.priority} />
            </div>

            <dl className={styles.detailList}>
              <div>
                <dt>Olusturan</dt>
                <dd>{ticket.createdByName ?? "Belirsiz"}</dd>
              </div>
              <div>
                <dt>Birim</dt>
                <dd>{ticket.departmentName ?? "Belirsiz"}</dd>
              </div>
              <div>
                <dt>Atanan</dt>
                <dd>{ticket.assignedTechnicianName ?? "Atanmamis"}</dd>
              </div>
              <div>
                <dt>Tarih</dt>
                <dd>{formatTicketDateTime(ticket.createdAt)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </>
  );
}
