import Link from "next/link";

import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.intro}>
          <span className={styles.badge}>Prototip Giriş</span>
          <h1>Web paneli için demo giriş ekranı</h1>
          <p>
            Bu form gerçek kimlik doğrulama yapmaz. Alanlar yalnızca sonraki
            aşamada eklenecek oturum akışını temsil eder.
          </p>
        </div>

        <form className={styles.form} action="/dashboard" method="get">
          <label className={styles.field}>
            <span>E-posta</span>
            <input
              type="email"
              name="email"
              placeholder="ornek.personel@demo.local"
              autoComplete="off"
            />
          </label>

          <label className={styles.field}>
            <span>Parola</span>
            <input
              type="password"
              name="password"
              placeholder="Parola giriniz"
              autoComplete="off"
            />
          </label>

          <button type="submit" className={styles.submit}>
            Demo Giriş
          </button>

          <p className={styles.helper}>
            Buton güvenli biçimde demo dashboard sayfasına yönlendirir. Gerçek
            kullanıcı doğrulaması bu aşamada uygulanmamaktadır.
          </p>
        </form>

        <Link href="/" className={styles.backLink}>
          Ana sayfaya dön
        </Link>
      </section>
    </main>
  );
}
