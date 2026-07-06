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
          <span className={styles.badge}>SSR Giris</span>
          <h1>Teknik personel web paneline giris yapin</h1>
          <p>
            Bu ekran Supabase oturumu ile calisir. Web yonetim paneli yalnizca
            teknik personel ve yonetici rollerine aciktir.
          </p>
        </div>

        <LoginForm />

        <p className={styles.helper}>
          Personel rolundeki gecerli hesaplar giris yapabilir; ancak web paneli
          yerine erisim reddi ekrani gorur.
        </p>

        <Link href="/" className={styles.backLink}>
          Ana sayfaya don
        </Link>
      </section>
    </main>
  );
}
