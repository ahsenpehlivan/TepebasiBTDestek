import Link from "next/link";

import { StatusCard } from "@/components/ui/status-card";
import { getAuthState } from "@/lib/auth/server";
import { roleLabels } from "@/lib/constants/role-labels";
import { createClient } from "@/lib/supabase/server";
import type { StatItem } from "@/types/dashboard";

import styles from "./dashboard.module.css";

type CountResult = {
  count: number | null;
  hasError: boolean;
};

async function getTicketCount(status?: string): Promise<CountResult> {
  const supabase = await createClient();
  let query = supabase.from("tickets").select("id", {
    count: "exact",
    head: true,
  });

  if (status) {
    query = query.eq("status", status);
  }

  const { count, error } = await query;

  return {
    count,
    hasError: Boolean(error),
  };
}

async function getDashboardStats(): Promise<StatItem[]> {
  const [total, open, inProgress, resolved] = await Promise.all([
    getTicketCount(),
    getTicketCount("open"),
    getTicketCount("in_progress"),
    getTicketCount("resolved"),
  ]);

  const hasError =
    total.hasError || open.hasError || inProgress.hasError || resolved.hasError;

  if (hasError) {
    return [
      {
        label: "Toplam Ticket",
        value: "-",
        detail: "Ticket sayac verisi su anda alinamadi.",
        tone: "neutral",
      },
      {
        label: "Acik",
        value: "-",
        detail: "Ticket sayac verisi su anda alinamadi.",
        tone: "warning",
      },
      {
        label: "Islemde",
        value: "-",
        detail: "Ticket sayac verisi su anda alinamadi.",
        tone: "accent",
      },
      {
        label: "Cozuldu",
        value: "-",
        detail: "Ticket sayac verisi su anda alinamadi.",
        tone: "success",
      },
    ];
  }

  return [
    {
      label: "Toplam Ticket",
      value: String(total.count ?? 0),
      detail: "Veritabanindaki toplam teknik destek kaydi.",
      tone: "neutral",
    },
    {
      label: "Acik",
      value: String(open.count ?? 0),
      detail: "Henuz atama veya islem bekleyen kayitlar.",
      tone: "warning",
    },
    {
      label: "Islemde",
      value: String(inProgress.count ?? 0),
      detail: "Teknik ekip tarafindan uzerinde calisilan kayitlar.",
      tone: "accent",
    },
    {
      label: "Cozuldu",
      value: String(resolved.count ?? 0),
      detail: "Resolved durumunda bekleyen kayitlar.",
      tone: "success",
    },
  ];
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [authState, stats] = await Promise.all([
    getAuthState(),
    getDashboardStats(),
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
              <h2>Ticket akisina gecin</h2>
            </div>
          </div>

          <p>
            Sayfa ustundeki sayaclar `tickets` tablosundan okunur. Detayli
            listeyi gormek icin korumali ticket ekranini kullanabilirsiniz.
          </p>

          <Link href="/tickets" className={styles.primaryAction}>
            Ticket Listesini Ac
          </Link>
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
            <li>Gercek ticket listeleme icin temel panel iskeleti</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
