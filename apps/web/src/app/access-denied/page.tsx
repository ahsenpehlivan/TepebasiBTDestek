import { redirect } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { getAuthState } from "@/lib/auth/server";
import { roleLabels } from "@/lib/constants/role-labels";

import styles from "./access-denied.module.css";

export const dynamic = "force-dynamic";

export default async function AccessDeniedPage() {
  const authState = await getAuthState();

  if (authState.status === "anonymous") {
    redirect("/login");
  }

  if (authState.status === "missing_profile") {
    redirect("/auth-error");
  }

  if (!authState.profile) {
    redirect("/login");
  }

  const title = authState.profile.isActive
    ? "Web paneli erisimi sinirlandi"
    : "Hesap durumu pasif";

  const description = authState.profile.isActive
    ? "Bu web paneli teknik personel ve yoneticiler icin hazirlanmistir."
    : "Profil kaydiniz pasif oldugu icin yonetim paneline erisim verilemiyor.";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.badge}>Erisim Denetimi</span>
        <h1>{title}</h1>
        <p>{description}</p>

        <dl className={styles.metaList}>
          <div>
            <dt>Kullanici Rolu</dt>
            <dd>{roleLabels[authState.profile.role]}</dd>
          </div>
          <div>
            <dt>E-posta</dt>
            <dd>{authState.profile.email ?? "Tanimsiz"}</dd>
          </div>
        </dl>

        <form action={logoutAction}>
          <button type="submit" className={styles.logoutButton}>
            Oturumu Kapat
          </button>
        </form>
      </section>
    </main>
  );
}
