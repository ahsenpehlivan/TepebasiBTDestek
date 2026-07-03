import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Kurum İçi Prototip</span>
          <h1>Teknik destek talepleri ve cihaz envanteri için sade bir başlangıç paneli.</h1>
          <p>
            Tepebaşı BT Destek, belediye personeli ile teknik ekiplerin ileriki
            aşamalarda aynı süreçleri daha düzenli takip edebilmesi için
            hazırlanan bir prototiptir.
          </p>

          <div className={styles.actions}>
            <Link href="/login" className={styles.primaryAction}>
              Yönetim Paneline Git
            </Link>
            <span className={styles.note}>
              Bu ekrandaki içerikler demo amaçlıdır ve gerçek kurum verisi içermez.
            </span>
          </div>
        </div>

        <aside className={styles.summary}>
          <div className={styles.summaryCard}>
            <h2>İlk Aşama Kapsamı</h2>
            <ul className={styles.list}>
              <li>Web panel iskeleti</li>
              <li>Android prototip açılış ekranı</li>
              <li>Supabase yapılandırma hazırlığı</li>
            </ul>
          </div>

          <div className={styles.summaryCard}>
            <h2>Bu Aşamada Yok</h2>
            <ul className={styles.list}>
              <li>Gerçek giriş işlemi</li>
              <li>Canlı veritabanı tabloları</li>
              <li>Kurum sistemleri entegrasyonu</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
