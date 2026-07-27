import Link from "next/link";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Tepebaşı BT Destek</span>
          <h1>Belediye içi teknik destek ve cihaz envanteri yönetimi</h1>
          <p>
            Tepebaşı BT Destek, belediye personeli ile teknik ekiplerin teknik
            destek süreçlerini ve cihaz envanterini daha düzenli takip
            edebilmesi için hazırlanmış bir demo uygulamadır.
          </p>

          <div className={styles.actions}>
            <Link href="/login" className={styles.primaryAction}>
              Giriş Ekranına Git
            </Link>
            <span className={styles.note}>
              Demo amaçlı test hesaplarıyla kullanılabilir. Gerçek kurum verisi içermez.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
