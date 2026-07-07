import Link from "next/link";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/actions/auth";
import { PanelNav } from "@/components/layout/panel-nav";
import { roleLabels } from "@/lib/constants/role-labels";
import type { AuthenticatedProfile } from "@/types/domain";

import styles from "./panel-shell.module.css";

type PanelShellProps = {
  profile: AuthenticatedProfile;
  children: ReactNode;
};

const navigationItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Talepler", href: "/tickets" },
  { label: "Cihazlar", href: "/devices" },
];

export function PanelShell({ profile, children }: PanelShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandBlock}>
            <span className={styles.eyebrow}>Tepebasi BT Destek</span>
            <Link href="/" className={styles.title}>
              Yonetici ve Teknik Personel Paneli
            </Link>
          </div>

          <PanelNav items={navigationItems} />

          <div className={styles.userPanel}>
            <div className={styles.userMeta}>
              <strong>{profile.fullName}</strong>
              <span>
                {roleLabels[profile.role]}
                {profile.departmentName ? ` - ${profile.departmentName}` : ""}
              </span>
            </div>

            <form action={logoutAction}>
              <button type="submit" className={styles.logoutButton}>
                Oturumu Kapat
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
