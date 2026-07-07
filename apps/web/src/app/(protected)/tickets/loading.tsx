import { StateCard } from "@/components/ui/state-card";
import styles from "./tickets.module.css";

export default function TicketsLoading() {
  return (
    <div className={styles.page}>
      <StateCard
        tone="loading"
        title="Ticket listesi yukleniyor..."
        description="Sunucu tarafindaki sorgu tamamlaninca son kayitlar gosterilecektir."
      />
    </div>
  );
}
