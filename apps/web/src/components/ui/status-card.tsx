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
        <span className={styles.toneLabel} data-tone={item.tone}>
          {item.tone === "success"
            ? "Olumlu"
            : item.tone === "warning"
              ? "Dikkat"
              : item.tone === "accent"
                ? "Güncel"
                : "Bilgi"}
        </span>
      </div>

      <strong className={styles.value}>{item.value}</strong>
      <p className={styles.detail}>{item.detail}</p>
    </article>
  );
}
