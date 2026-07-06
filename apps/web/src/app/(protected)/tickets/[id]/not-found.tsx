import Link from "next/link";

import styles from "./ticket-detail.module.css";

export default function TicketNotFound() {
  return (
    <section className={styles.messageCard}>
      <h1>Ticket bulunamadi</h1>
      <p>
        Bu ticket kaydina erisim izniniz olmayabilir veya kayit artik mevcut olmayabilir.
      </p>
      <Link href="/tickets" className={styles.backLink}>
        Ticket listesine don
      </Link>
    </section>
  );
}
