import styles from "./ticket-detail.module.css";

export default function TicketDetailLoading() {
  return (
    <section className={styles.messageCard}>
      <h1>Talep detayi yukleniyor...</h1>
      <p>Sunucu sorgulari tamamlandiginda talep ozeti ve yorumlar gosterilecektir.</p>
    </section>
  );
}
