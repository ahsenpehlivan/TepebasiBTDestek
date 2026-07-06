"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./panel-shell.module.css";

type NavigationItem = {
  label: string;
  href: string;
};

type PanelNavProps = {
  items: NavigationItem[];
};

export function PanelNav({ items }: PanelNavProps) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Panel gezinme">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={styles.navLink}
            data-active={isActive ? "true" : "false"}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
