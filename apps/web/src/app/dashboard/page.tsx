import Link from "next/link";

import { PanelShell } from "@/components/layout/panel-shell";
import { StatusCard } from "@/components/ui/status-card";
import { dashboardStats, quickActions, recentRequests } from "@/lib/demo-data";

import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <PanelShell>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Demo Dashboard</span>
          <h1>Teknik destek operasyonları için genel görünüm</h1>
          <p>
            Aşağıdaki tüm sayılar ve kayıtlar kurgusaldır. Bu ekran yalnızca
            prototip yerleşimini ve sonraki geliştirme alanlarını göstermek için
            hazırlanmıştır.
          </p>
        </div>

        <div className={styles.heroNotice}>
          <h2>Hazır Alanlar</h2>
          <p>Rol bazlı akışlar, talep takibi ve envanter yönetimi için başlangıç düzeni hazırlandı.</p>
        </div>
      </section>

      <section className={styles.statsGrid} aria-label="Özet kartları">
        {dashboardStats.map((item) => (
          <StatusCard key={item.label} item={item} />
        ))}
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.tableCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Talep Takibi</span>
              <h2>Son Teknik Destek Talepleri</h2>
            </div>
            <span className={styles.sectionHint}>Tamamı demo veridir</span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Talep No</th>
                  <th>Talep Sahibi</th>
                  <th>Birim</th>
                  <th>Kategori</th>
                  <th>Öncelik</th>
                  <th>Durum</th>
                  <th>Güncelleme</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.requester}</td>
                    <td>{request.unit}</td>
                    <td>{request.category}</td>
                    <td>{request.priority}</td>
                    <td>{request.status}</td>
                    <td>{request.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className={styles.sideColumn}>
          <article className={styles.actionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Hızlı İşlemler</span>
                <h2>İşlem Kısayolları</h2>
              </div>
            </div>

            <div className={styles.actionList}>
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href} className={styles.actionItem}>
                  <strong>{action.label}</strong>
                  <span>{action.description}</span>
                </Link>
              ))}
            </div>
          </article>

          <article className={styles.infoCard}>
            <h2>Prototip Notu</h2>
            <p>
              Gerçek authentication, CRUD, QR akışları ve Supabase entegrasyonu
              sonraki aşamalarda eklenecektir.
            </p>
          </article>
        </aside>
      </section>
    </PanelShell>
  );
}
