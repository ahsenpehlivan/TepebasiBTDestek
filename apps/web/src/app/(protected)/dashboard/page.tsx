import Link from "next/link";

import { StatusCard } from "@/components/ui/status-card";
import { StateCard } from "@/components/ui/state-card";
import { getAuthState } from "@/lib/auth/server";
import { roleLabels } from "@/lib/constants/role-labels";
import { loadDashboardStats } from "@/lib/tickets/queries";

import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [authState, stats] = await Promise.all([
    getAuthState(),
    loadDashboardStats(),
  ]);
  const hasStatsError = stats.some((item) => item.value === "-");

  if (!authState.profile) {
    return null;
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Canlı Yönetim Paneli</span>
          <h1>Hoş geldiniz, {authState.profile.fullName}</h1>
          <p>
            Giriş yapan kullanıcının rolü ve panel yetkisi sunucu tarafında
            doğrulanır. Bu alan gerçek oturum bilgisiyle açılır ve günlük iş
            takibini sade bir görünümde sunar.
          </p>
        </div>

        <aside className={styles.profileCard}>
          <h2>Oturum Bilgisi</h2>
          <dl className={styles.profileList}>
            <div>
              <dt>Rol</dt>
              <dd>{roleLabels[authState.profile.role]}</dd>
            </div>
            <div>
              <dt>E-posta</dt>
              <dd>{authState.profile.email ?? "Tanımsız"}</dd>
            </div>
            <div>
              <dt>Birim</dt>
              <dd>{authState.profile.departmentName ?? "Henüz atanmadı"}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className={styles.statsGrid} aria-label="Talep sayaçları">
        {stats.map((item) => (
          <StatusCard key={item.label} item={item} />
        ))}
      </section>

      {hasStatsError ? (
        <StateCard
          tone="error"
          title="Bazı dashboard verileri alınamadı"
          description="Sayaçların bir kısmı geçici olarak okunamadı. Panelin kalan bölümleri kullanılmaya devam edebilir; işlem öncesi sayfayı yenileyerek veriyi tekrar deneyin."
        />
      ) : null}

      <section className={styles.contentGrid}>
        <article className={styles.primaryCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Gerçek Veri</span>
              <h2>Talep ve cihaz kayıtlarına geçin</h2>
            </div>
          </div>

          <p>
            Sayfa üstündeki sayaçlar `tickets` ve `devices` tablolarından
            beslenir. Talep listesi ve cihaz envanteri aynı panel içinden kolayca
            açılabilir.
          </p>

          <div className={styles.actionGroup}>
            <Link href="/tickets" className={styles.primaryAction}>
              Talepleri Gör
            </Link>
            <Link href="/devices" className={styles.secondaryAction}>
              Cihazları Gör
            </Link>
          </div>
        </article>

        <article className={styles.secondaryCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Kapsam Notu</span>
              <h2>Bu panelde neler hazır?</h2>
            </div>
          </div>

          <ul className={styles.scopeList}>
            <li>SSR login ve logout akışı</li>
            <li>Profile tablosundan rol çözümleme</li>
            <li>Teknik personel ve yönetici için korunan route yapısı</li>
            <li>Gerçek talep listeleme, detay ve yorum akışları</li>
            <li>Gerçek cihaz listeleme, QR önizleme ve bakım kayıtları</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
