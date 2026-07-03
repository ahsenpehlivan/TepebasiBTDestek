import type { StatItem } from "@/types/dashboard";

import styles from "./status-card.module.css";

type StatusCardProps = {
  item: StatItem;
};

export function StatusCard({ item }: StatusCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.label}>{item.label}</h2>
        <span
          aria-hidden="true"
          className={`${styles.dot} ${styles[item.tone]}`}
        />
      </div>

      <strong className={styles.value}>{item.value}</strong>
      <p className={styles.detail}>{item.detail}</p>
    </article>
  );
}
