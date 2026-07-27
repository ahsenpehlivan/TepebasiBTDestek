import { StateCard } from "@/components/ui/state-card";
import styles from "./tickets.module.css";

export default function TicketsLoading() {
  return (
    <div className={styles.page}>
      <StateCard
        tone="loading"
        title="Talep listesi yükleniyor..."
        description="Sunucu tarafındaki sorgu tamamlanınca son kayıtlar gösterilecektir."
      />
    </div>
  );
}
