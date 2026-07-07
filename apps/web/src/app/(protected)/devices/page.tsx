import Link from "next/link";

import { DeviceFilterForm } from "@/components/devices/device-filter-form";
import { DeviceList } from "@/components/devices/device-list";
import { PageHeader } from "@/components/ui/page-header";
import { StateCard } from "@/components/ui/state-card";
import {
  loadActiveDepartments,
  loadDeviceList,
  parseDeviceListFilters,
} from "@/lib/devices/queries";

import styles from "./devices.module.css";

type DevicesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function DevicesPage({ searchParams }: DevicesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = parseDeviceListFilters(resolvedSearchParams);
  const [{ devices, hasError, limit }, departments] = await Promise.all([
    loadDeviceList(filters),
    loadActiveDepartments(),
  ]);
  const hasActiveFilters = Boolean(
    filters.query ||
      filters.deviceType !== "all" ||
      filters.status !== "all" ||
      filters.departmentId !== "all",
  );

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Envanter Paneli"
        title="Cihaz Envanteri"
        description="Bu sayfa cihaz kayıtlarını doğrudan sistem listesinden okur. Arama ve filtreleme alanları ile envanteri kolayca daraltabilirsiniz."
        actions={
          <Link href="/devices/new" className={styles.primaryLink}>
            Yeni Cihaz Ekle
          </Link>
        }
      />

      <section className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div>
            <h2>Arama ve filtreleme</h2>
            <p>
              Demirbaş kodu, marka veya model ile arama yapabilir; cihaz türü, durum
              ve birime göre envanteri daraltabilirsiniz.
            </p>
          </div>
          <span className={styles.limitHint}>Gösterilen kayıt: ilk {limit} cihaz</span>
        </div>

        <DeviceFilterForm departments={departments} filters={filters} />
      </section>

      {hasError ? (
        <StateCard
          tone="error"
          title="Cihaz listesi şu anda açılamadı"
          description="Veri geçici olarak okunamadı. Biraz sonra sayfayı yenileyerek tekrar deneyin."
        />
      ) : devices.length === 0 ? (
        <StateCard
          title={
            hasActiveFilters
              ? "Seçilen filtrelerle eşleşen cihaz bulunamadı."
              : "Henüz cihaz envanteri kaydı bulunmuyor."
          }
          description={
            hasActiveFilters
              ? "Filtreleri temizleyip envanteri yeniden deneyin."
              : "Demo cihaz kayıtları veya yeni eklenen envanter kayıtları burada listelenecektir."
          }
        />
      ) : (
        <DeviceList devices={devices} />
      )}
    </div>
  );
}
