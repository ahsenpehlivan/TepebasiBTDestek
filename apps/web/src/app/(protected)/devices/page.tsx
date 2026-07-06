import Link from "next/link";

import { DeviceFilterForm } from "@/components/devices/device-filter-form";
import { DeviceList } from "@/components/devices/device-list";
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
      <section className={styles.headerCard}>
        <div className={styles.headerContent}>
          <div>
            <span className={styles.eyebrow}>Envanter Paneli</span>
            <h1>Cihaz Envanteri</h1>
            <p>
              Bu sayfa veriyi dogrudan Supabase `devices` tablosundan okur. Liste
              asset tag sirasiyla gelir ve filtreler server-side sorguya uygulanir.
            </p>
          </div>

          <Link href="/devices/new" className={styles.primaryLink}>
            Yeni Cihaz Ekle
          </Link>
        </div>
      </section>

      <section className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <div>
            <h2>Arama ve filtreleme</h2>
            <p>
              Asset tag, marka veya model ile arama yapabilir; cihaz tipi, durum ve
              departman bazinda envanteri daraltabilirsiniz.
            </p>
          </div>
          <span className={styles.limitHint}>Liste limiti: ilk {limit} kayit</span>
        </div>

        <DeviceFilterForm departments={departments} filters={filters} />
      </section>

      {hasError ? (
        <section className={styles.messageCard}>
          <h2>Envanter listesi su anda yuklenemedi</h2>
          <p>
            Cihaz sorgusu basarisiz oldu. Supabase baglanti ayarlarini ve veritabani
            erisimini kontrol ettikten sonra sayfayi yenileyin.
          </p>
        </section>
      ) : devices.length === 0 ? (
        <section className={styles.messageCard}>
          <h2>
            {hasActiveFilters
              ? "Secilen filtrelerle eslesen cihaz bulunamadi."
              : "Henuz cihaz envanteri kaydi bulunmuyor."}
          </h2>
          <p>
            {hasActiveFilters
              ? "Filtreleri temizleyip envanteri yeniden deneyin."
              : "Demo cihaz seed kayitlari veya technician/admin tarafindan acilan yeni envanter kayitlari burada listelenecektir."}
          </p>
        </section>
      ) : (
        <DeviceList devices={devices} />
      )}
    </div>
  );
}
