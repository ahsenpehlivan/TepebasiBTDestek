import { redirect } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { getAuthState, getPostLoginPath } from "@/lib/auth/server";

import styles from "./auth-error.module.css";

export const dynamic = "force-dynamic";

export default async function AuthErrorPage() {
  const authState = await getAuthState();

  if (authState.status === "anonymous") {
    redirect("/login");
  }

  if (authState.status === "inactive") {
    redirect("/access-denied");
  }

  if (authState.profile) {
    redirect(getPostLoginPath(authState.profile.role));
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.badge}>Yönlendirme Bilgisi</span>
        <h1>Hesap bilgisi tamamlanamadı</h1>
        <p>
          Giriş işlemi doğrulandı; ancak hesabınız için gerekli panel bilgileri
          hazır olmadığından sayfa açılamadı. Demo kullanıcı kurulumu ve profil
          eşleşmesi kontrol edilmelidir.
        </p>

        <form action={logoutAction}>
          <button type="submit" className={styles.logoutButton}>
            Oturumu Kapat
          </button>
        </form>
      </section>
    </main>
  );
}
