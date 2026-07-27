import styles from "./device-detail.module.css";

export default function DeviceDetailLoading() {
  return (
    <section className={styles.messageCard}>
      <h1>Cihaz detayı yükleniyor...</h1>
      <p>İlgili envanter kaydı ve bakım geçmişi hazırlanıyor.</p>
    </section>
  );
}
