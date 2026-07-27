import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getAuthState, getPostLoginPath } from "@/lib/auth/server";

import styles from "./login.module.css";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const authState = await getAuthState();

  if (authState.status === "missing_profile") {
    redirect("/auth-error");
  }

  if (authState.status === "inactive") {
    redirect("/access-denied");
  }

  if (authState.profile) {
    redirect(getPostLoginPath(authState.profile.role));
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.intro}>
          <span className={styles.badge}>Güvenli Giriş</span>
          <h1>Tepebaşı BT Destek web paneline giriş yapın</h1>
          <p>
            Bu ekran belediye Bilgi İşlem birimi için hazırlanan demo web paneline
            güvenli giriş sağlar. Panel yalnızca teknik personel ve yönetici
            rollerine açıktır.
          </p>
        </div>

        <LoginForm />

        <p className={styles.helper}>
          Personel rolündeki hesaplar giriş yapabilir; ancak yetki durumuna göre
          erişim bilgilendirme ekranı görür.
        </p>

        <Link href="/" className={styles.backLink}>
          Ana sayfaya dön
        </Link>
      </section>
    </main>
  );
}
