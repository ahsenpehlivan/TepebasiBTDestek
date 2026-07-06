import { TicketFilterForm } from "@/components/tickets/ticket-filter-form";
import { TicketList } from "@/components/tickets/ticket-list";
import { loadTicketList, parseTicketListFilters } from "@/lib/tickets/queries";

import styles from "./tickets.module.css";

type TicketsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = parseTicketListFilters(resolvedSearchParams);
  const { tickets, hasError, limit } = await loadTicketList(filters);
  const hasActiveFilters = Boolean(
    filters.query ||
      filters.status !== "all" ||
      filters.priority !== "all" ||
      filters.category !== "all",
  );

  return (
    <div className={styles.page}>
      <section className={styles.headerCard}>
        <span className={styles.eyebrow}>RLS Tabanli Liste</span>
        <h1>Teknik Destek Talepleri</h1>
        <p>
          Bu sayfa veriyi dogrudan Supabase `tickets` tablosundan okur. Filtreler
          server-side sorguya uygulanir ve kayitlar en yeni olusturulandan eskiye
          dogru siralanir.
        </p>
      </section>

      <section className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div>
            <h2>Arama ve filtreleme</h2>
            <p>
              Baslik veya tam ticket numarasi ile arama yapabilir; durum, oncelik ve
              kategori bazinda listeyi daraltabilirsiniz.
            </p>
          </div>
          <span className={styles.limitHint}>Liste limiti: ilk {limit} kayit</span>
        </div>

        <TicketFilterForm filters={filters} />
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
          <h2>
            {hasActiveFilters
              ? "Secilen filtrelerle eslesen ticket bulunamadi."
              : "Henuz teknik destek talebi bulunmuyor."}
          </h2>
          <p>
            {hasActiveFilters
              ? "Filtreleri temizleyip listeyi yeniden deneyin."
              : "Kontrollu demo ticket verileri uygulandiginda kayitlar burada listelenecektir."}
          </p>
        </section>
      ) : (
        <TicketList tickets={tickets} />
      )}
    </div>
  );
}
