import Link from "next/link";

import styles from "./device-detail.module.css";

export default function DeviceNotFound() {
  return (
    <section className={styles.messageCard}>
      <h1>Cihaz kaydı bulunamadı</h1>
      <p>
        İstediğiniz cihaz kaydı mevcut değil veya bu kayda erişim yetkiniz yok.
      </p>
      <Link href="/devices" className={styles.backLink}>
        Cihaz listesine dön
      </Link>
    </section>
  );
}
