import Link from "next/link";

import styles from "./ticket-detail.module.css";

export default function TicketNotFound() {
  return (
    <section className={styles.messageCard}>
      <h1>Talep bulunamadı</h1>
      <p>
        Bu talep kaydına erişim izniniz olmayabilir veya kayıt artık mevcut olmayabilir.
      </p>
      <Link href="/tickets" className={styles.backLink}>
        Talep listesine dön
      </Link>
    </section>
  );
}
