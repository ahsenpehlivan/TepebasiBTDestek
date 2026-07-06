import styles from "./devices.module.css";

export default function DevicesLoading() {
  return (
    <section className={styles.messageCard}>
      <h2>Cihaz envanteri yukleniyor...</h2>
      <p>Server-side cihaz sorgusu hazirlaniyor. Lutfen bekleyin.</p>
    </section>
  );
}
