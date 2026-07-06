import styles from "./device-detail.module.css";

export default function DeviceDetailLoading() {
  return (
    <section className={styles.messageCard}>
      <h1>Cihaz detayi yukleniyor...</h1>
      <p>Ilgili envanter kaydi ve bakim gecmisi hazirlaniyor.</p>
    </section>
  );
}
