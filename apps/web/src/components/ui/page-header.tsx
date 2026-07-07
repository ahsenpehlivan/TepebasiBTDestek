import type { ReactNode } from "react";

import styles from "./page-header.module.css";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  meta?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
}: PageHeaderProps) {
  return (
    <section className={styles.card}>
      <div className={styles.content}>
        <div>
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>

      {meta ? <div className={styles.meta}>{meta}</div> : null}
    </section>
  );
}
