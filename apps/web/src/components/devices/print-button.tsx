"use client";

import styles from "./print-button.module.css";

export function PrintButton() {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => window.print()}
    >
      Yazdirmaya Hazirla
    </button>
  );
}
