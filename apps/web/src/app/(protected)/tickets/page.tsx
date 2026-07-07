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
        eyebrow="Talep Listesi"
        title="Teknik Destek Talepleri"
        description="Bu sayfa talepleri doğrudan sistem kayıtlarından okur. Arama ve filtreleme alanları ile listeyi kolayca daraltabilirsiniz."
      />

      <section className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div>
            <h2>Arama ve filtreleme</h2>
            <p>
              Talep başlığı veya talep numarası ile arama yapabilir; durum,
              öncelik ve kategoriye göre listeyi daraltabilirsiniz.
            </p>
          </div>
          <span className={styles.limitHint}>Gösterilen kayıt: ilk {limit} talep</span>
        </div>

        <TicketFilterForm filters={filters} />
      </section>

      {hasError ? (
        <StateCard
          tone="error"
          title="Talep listesi şu anda açılamadı"
          description="Veri geçici olarak okunamadı. Biraz sonra sayfayı yenileyerek tekrar deneyin."
        />
      ) : tickets.length === 0 ? (
        <StateCard
          title={
            hasActiveFilters
              ? "Seçilen filtrelerle eşleşen talep bulunamadı."
              : "Henüz teknik destek talebi bulunmuyor."
          }
          description={
            hasActiveFilters
              ? "Filtreleri temizleyip listeyi yeniden deneyin."
              : "Demo talep kayıtları oluştuğunda burada listelenecektir."
          }
        />
      ) : (
        <TicketList tickets={tickets} />
      )}
    </div>
  );
}
