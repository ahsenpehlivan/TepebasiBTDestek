import Link from "next/link";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Kurum Ici Prototip</span>
          <h1>Teknik destek talepleri ve cihaz envanteri icin sade bir baslangic paneli.</h1>
          <p>
            Tepebasi BT Destek, belediye personeli ile teknik ekiplerin ayni teknik
            destek sureclerini daha duzenli takip edebilmesi icin hazirlanan cok
            platformlu bir prototiptir. Web panelinde Supabase tabanli giris ve rol
            kontrollu teknik personel erisimi kurulmustur.
          </p>

          <div className={styles.actions}>
            <Link href="/login" className={styles.primaryAction}>
              Yonetim Paneline Git
            </Link>
            <span className={styles.note}>
              Bu ekrandaki icerikler demo amaclidir ve gercek kurum verisi icermez.
            </span>
          </div>
        </div>

        <aside className={styles.summary}>
          <div className={styles.summaryCard}>
            <h2>Mevcut Web Kapsami</h2>
            <ul className={styles.list}>
              <li>SSR tabanli login ve logout</li>
              <li>Profile ve rol cozumleme</li>
              <li>Gercek ticket listesi icin korumali web route yapisi</li>
            </ul>
          </div>

          <div className={styles.summaryCard}>
            <h2>Bu Asamada Yok</h2>
            <ul className={styles.list}>
              <li>Ticket olusturma ve guncelleme</li>
              <li>Yorum ve dosya yukleme akisleri</li>
              <li>Kurum sistemleri entegrasyonu ve gercek veri kullanimi</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
