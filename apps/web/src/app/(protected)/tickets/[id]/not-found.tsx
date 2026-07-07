import Link from "next/link";

import styles from "./ticket-detail.module.css";

export default function TicketNotFound() {
  return (
    <section className={styles.messageCard}>
      <h1>Talep bulunamadi</h1>
      <p>
        Bu talep kaydina erisim izniniz olmayabilir veya kayit artik mevcut olmayabilir.
      </p>
      <Link href="/tickets" className={styles.backLink}>
        Talep listesine don
      </Link>
    </section>
  );
}
