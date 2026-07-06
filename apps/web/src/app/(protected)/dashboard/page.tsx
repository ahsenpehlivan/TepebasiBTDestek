import Link from "next/link";

import { StatusCard } from "@/components/ui/status-card";
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

  if (!authState.profile) {
    return null;
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Canli Web Paneli</span>
          <h1>Hos geldiniz, {authState.profile.fullName}</h1>
          <p>
            Giris yapan kullanicinin rolu, aktiflik durumu ve profil kaydi
            sunucu tarafinda dogrulanir. Bu alan gercek Supabase oturumu ile
            acilmistir.
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
              <dd>{authState.profile.email ?? "Tanimsiz"}</dd>
            </div>
            <div>
              <dt>Birim</dt>
              <dd>{authState.profile.departmentName ?? "Henuz atanmadi"}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className={styles.statsGrid} aria-label="Ticket sayaclari">
        {stats.map((item) => (
          <StatusCard key={item.label} item={item} />
        ))}
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.primaryCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Gercek Veri</span>
              <h2>Ticket ve cihaz akisina gecin</h2>
            </div>
          </div>

          <p>
            Sayfa ustundeki sayaclar `tickets` ve `devices` tablolarindan
            beslenir. Ticket listesi ve cihaz envanteri korumali panel
            icinden gercek Supabase oturumu ile acilir.
          </p>

          <div className={styles.actionGroup}>
            <Link href="/tickets" className={styles.primaryAction}>
              Ticket Listesini Ac
            </Link>
            <Link href="/devices" className={styles.secondaryAction}>
              Cihaz Envanterini Ac
            </Link>
          </div>
        </article>

        <article className={styles.secondaryCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Kapsam Notu</span>
              <h2>Bu asamada korunan alanlar</h2>
            </div>
          </div>

          <ul className={styles.scopeList}>
            <li>SSR login ve logout akisi</li>
            <li>Profile tablosundan rol cozumleme</li>
            <li>Technician ve admin icin protected route yapisi</li>
            <li>Gercek ticket listeleme, detay ve yorum akislari</li>
            <li>Gercek cihaz listeleme, QR onizleme ve bakim kayitlari</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
