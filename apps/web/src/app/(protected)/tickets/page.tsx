import {
  ticketCategoryLabels,
  ticketPriorityLabels,
  ticketStatusLabels,
} from "@/lib/constants/ticket-labels";
import { createClient } from "@/lib/supabase/server";
import type { TicketListItem } from "@/types/domain";

import styles from "./tickets.module.css";

type TicketRow = {
  id: string;
  ticket_number: number | string;
  title: string;
  category: TicketListItem["category"];
  priority: TicketListItem["priority"];
  status: TicketListItem["status"];
  created_at: string;
  assigned_to: string | null;
};

type ProfileNameRow = {
  id: string;
  full_name: string;
};

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

async function loadTickets() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select("id, ticket_number, title, category, priority, status, created_at, assigned_to")
    .order("created_at", { ascending: false })
    .limit(25)
    .returns<TicketRow[]>();

  if (error) {
    return {
      tickets: [] as TicketListItem[],
      hasError: true,
    };
  }

  const rows = data ?? [];
  const assignedIds = Array.from(
    new Set(rows.flatMap((row) => (row.assigned_to ? [row.assigned_to] : []))),
  );

  let assigneeMap = new Map<string, string>();

  if (assignedIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", assignedIds)
      .returns<ProfileNameRow[]>();

    assigneeMap = new Map(
      (profiles ?? []).map((profile) => [profile.id, profile.full_name]),
    );
  }

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
        ? assigneeMap.get(row.assigned_to) ?? null
        : null,
    })),
    hasError: false,
  };
}

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const { tickets, hasError } = await loadTickets();

  return (
    <div className={styles.page}>
      <section className={styles.headerCard}>
        <span className={styles.eyebrow}>RLS Tabanli Liste</span>
        <h1>Teknik Destek Talepleri</h1>
        <p>
          Bu sayfa veriyi dogrudan Supabase `tickets` tablosundan okur. Liste
          technician ve admin rollerinin mevcut RLS yetkileri ile gelir.
        </p>
      </section>

      {hasError ? (
        <section className={styles.messageCard}>
          <h2>Liste su anda yuklenemedi</h2>
          <p>
            Ticket sorgusu basarisiz oldu. Supabase baglanti ayarlarini ve
            veritabani erisimini kontrol ettikten sonra sayfayi yenileyin.
          </p>
        </section>
      ) : tickets.length === 0 ? (
        <section className={styles.messageCard}>
          <h2>Henuz teknik destek talebi bulunmuyor.</h2>
          <p>Demo ticket verileri sonraki asamada olusturulacaktir.</p>
        </section>
      ) : (
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
                  <th>Olusturulma</th>
                  <th>Atanan</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.ticketNumber}</td>
                    <td>{ticket.title}</td>
                    <td>{ticketCategoryLabels[ticket.category]}</td>
                    <td>{ticketPriorityLabels[ticket.priority]}</td>
                    <td>{ticketStatusLabels[ticket.status]}</td>
                    <td>{formatCreatedAt(ticket.createdAt)}</td>
                    <td>{ticket.assignedTechnicianName ?? "Atanmamis"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
