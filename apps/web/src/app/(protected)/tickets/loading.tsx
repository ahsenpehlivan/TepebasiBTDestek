import styles from "./tickets.module.css";

export default function TicketsLoading() {
  return (
    <section className={styles.messageCard}>
      <h2>Ticket listesi yukleniyor...</h2>
      <p>Sunucu tarafindaki sorgu tamamlaninca son kayitlar gosterilecektir.</p>
    </section>
  );
}
