import styles from "./ticket-detail.module.css";

export default function TicketDetailLoading() {
  return (
    <section className={styles.messageCard}>
      <h1>Ticket detayi yukleniyor...</h1>
      <p>Sunucu sorgulari tamamlandiginda ticket ozeti ve yorumlar gosterilecektir.</p>
    </section>
  );
}
