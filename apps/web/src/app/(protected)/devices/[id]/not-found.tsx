import Link from "next/link";

import styles from "./device-detail.module.css";

export default function DeviceNotFound() {
  return (
    <section className={styles.messageCard}>
      <h1>Cihaz kaydi bulunamadi</h1>
      <p>
        Istediginiz cihaz kaydi mevcut degil veya bu kayda erisim yetkiniz yok.
      </p>
      <Link href="/devices" className={styles.backLink}>
        Cihaz listesine don
      </Link>
    </section>
  );
}
