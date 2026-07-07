import { PageHeader } from "@/components/ui/page-header";
import { StateCard } from "@/components/ui/state-card";
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
      <PageHeader
        eyebrow="RLS Tabanli Liste"
        title="Teknik Destek Talepleri"
        description="Bu sayfa veriyi dogrudan Supabase `tickets` tablosundan okur. Filtreler server-side sorguya uygulanir ve kayitlar en yeni olusturulandan eskiye dogru siralanir."
      />

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
        <StateCard
          tone="error"
          title="Liste su anda yuklenemedi"
          description="Ticket sorgusu basarisiz oldu. Supabase baglanti ayarlarini ve veritabani erisimini kontrol ettikten sonra sayfayi yenileyin."
        />
      ) : tickets.length === 0 ? (
        <StateCard
          title={
            hasActiveFilters
              ? "Secilen filtrelerle eslesen ticket bulunamadi."
              : "Henuz teknik destek talebi bulunmuyor."
          }
          description={
            hasActiveFilters
              ? "Filtreleri temizleyip listeyi yeniden deneyin."
              : "Kontrollu demo ticket verileri uygulandiginda kayitlar burada listelenecektir."
          }
        />
      ) : (
        <TicketList tickets={tickets} />
      )}
    </div>
  );
}
