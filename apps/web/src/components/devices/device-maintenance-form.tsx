"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  createDeviceMaintenanceAction,
  type DeviceActionState,
} from "@/app/(protected)/devices/actions";
import {
  maintenanceTypeLabels,
  maintenanceTypeOptions,
} from "@/lib/constants/device-labels";
import type { DeviceRelatedTicketItem } from "@/types/domain";

import styles from "./device-maintenance-form.module.css";

const initialActionState: DeviceActionState = {
  error: null,
  success: null,
  redirectTo: null,
};

type DeviceMaintenanceFormProps = {
  deviceId: string;
  relatedTickets: DeviceRelatedTicketItem[];
};

export function DeviceMaintenanceForm({
  deviceId,
  relatedTickets,
}: DeviceMaintenanceFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createDeviceMaintenanceAction,
    initialActionState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <article className={styles.card}>
      <h3>Bakim kaydi ekle</h3>
      <form ref={formRef} action={formAction} className={styles.form}>
        <input type="hidden" name="deviceId" value={deviceId} />

        <label className={styles.field}>
          <span>Bakim tipi</span>
          <select name="maintenanceType" defaultValue="inspection">
            {maintenanceTypeOptions.map((maintenanceType) => (
              <option key={maintenanceType} value={maintenanceType}>
                {maintenanceTypeLabels[maintenanceType]}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Bakim aciklamasi</span>
          <textarea
            name="description"
            rows={4}
            placeholder="Yapilan kontrol, onarim veya guncelleme notunu yazin."
            required
          />
        </label>

        <div className={styles.inlineGrid}>
          <label className={styles.field}>
            <span>Ilgili ticket</span>
            <select name="relatedTicketId" defaultValue="">
              <option value="">Ticket baglama</option>
              {relatedTickets.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  #{ticket.ticketNumber} - {ticket.title}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Maliyet</span>
            <input type="number" name="cost" min="0" step="0.01" placeholder="0.00" />
          </label>
        </div>

        <label className={styles.field}>
          <span>Kullanilan parcilar</span>
          <input
            type="text"
            name="partsUsed"
            placeholder="Ornek: Demo toner seti, SSD yukseltmesi"
          />
        </label>

        {state.error ? (
          <p className={styles.errorMessage} role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? <p className={styles.successMessage}>{state.success}</p> : null}

        <button type="submit" className={styles.primaryButton} disabled={pending}>
          {pending ? "Bakim kaydediliyor..." : "Bakim Kaydini Ekle"}
        </button>
      </form>
    </article>
  );
}
