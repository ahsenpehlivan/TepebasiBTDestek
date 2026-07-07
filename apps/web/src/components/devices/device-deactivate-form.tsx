"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  deactivateDeviceAction,
  type DeviceActionState,
} from "@/app/(protected)/devices/actions";

import styles from "./device-deactivate-form.module.css";

const initialActionState: DeviceActionState = {
  error: null,
  success: null,
  redirectTo: null,
};

type DeviceDeactivateFormProps = {
  deviceId: string;
  disabled?: boolean;
};

export function DeviceDeactivateForm({
  deviceId,
  disabled = false,
}: DeviceDeactivateFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    deactivateDeviceAction,
    initialActionState,
  );

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo]);

  return (
    <article className={styles.card}>
      <h3>Cihazı pasife al</h3>
      <p>
        Hard delete uygulanmaz. Bu işlem cihaz kaydını pasif ve `retired`
        durumuna alır.
      </p>

      <form action={formAction} className={styles.form}>
        <input type="hidden" name="deviceId" value={deviceId} />

        <label className={styles.field}>
          <span>Onay</span>
          <input
            type="text"
            name="confirmation"
            placeholder="PASIFE_AL"
            disabled={disabled}
          />
          <small className={styles.fieldHint}>
            Yanlışlıkla pasife alma riskini azaltmak için onay metnini eksiksiz
            yazın.
          </small>
        </label>

        {state.error ? (
          <p className={styles.errorMessage} role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className={styles.successMessage} aria-live="polite">
            {state.success}
          </p>
        ) : null}

        <button
          type="submit"
          className={styles.dangerButton}
          disabled={disabled || pending}
        >
          {pending ? "Pasife alınıyor..." : "Pasife Al"}
        </button>
      </form>
    </article>
  );
}
