import type { ReactNode } from "react";

import styles from "./state-card.module.css";

type StateCardProps = {
  title: string;
  description: string;
  tone?: "neutral" | "loading" | "error";
  action?: ReactNode;
};

export function StateCard({
  title,
  description,
  tone = "neutral",
  action,
}: StateCardProps) {
  return (
    <section className={styles.card} data-tone={tone}>
      <div className={styles.copy}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </section>
  );
}
