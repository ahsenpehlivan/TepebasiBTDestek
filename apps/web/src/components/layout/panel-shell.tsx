import Link from "next/link";
import type { ReactNode } from "react";

import { dashboardNavigation } from "@/lib/demo-data";

import styles from "./panel-shell.module.css";

type PanelShellProps = {
  children: ReactNode;
};

export function PanelShell({ children }: PanelShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandBlock}>
            <span className={styles.eyebrow}>Tepebaşı BT Destek</span>
            <Link href="/" className={styles.title}>
              Yönetici ve Teknik Personel Paneli
            </Link>
          </div>

          <nav className={styles.nav} aria-label="Panel gezinme">
            {dashboardNavigation.map((item) => (
              <Link key={item.label} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.badge}>Demo Dashboard</div>
        </div>
      </header>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
