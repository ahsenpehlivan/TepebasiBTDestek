import { StateCard } from "@/components/ui/state-card";
import styles from "./devices.module.css";

export default function DevicesLoading() {
  return (
    <div className={styles.page}>
      <StateCard
        tone="loading"
        title="Cihaz envanteri yukleniyor..."
        description="Server-side cihaz sorgusu hazirlaniyor. Lutfen bekleyin."
      />
    </div>
  );
}
