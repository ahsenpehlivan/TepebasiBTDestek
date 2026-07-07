"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createDeviceAction,
  type DeviceActionState,
  updateDeviceAction,
} from "@/app/(protected)/devices/actions";
import {
  deviceStatusLabels,
  deviceStatusOptions,
  deviceTypeLabels,
  deviceTypeOptions,
} from "@/lib/constants/device-labels";
import { roleLabels } from "@/lib/constants/role-labels";
import type {
  DepartmentRecord,
  DeviceFormRecord,
  DeviceUserOption,
} from "@/types/domain";

import styles from "./device-editor-form.module.css";

const initialActionState: DeviceActionState = {
  error: null,
  success: null,
  redirectTo: null,
};

type DeviceEditorFormProps = {
  assignees: DeviceUserOption[];
  departments: Pick<DepartmentRecord, "id" | "name">[];
  device?: DeviceFormRecord | null;
  mode: "create" | "edit";
};

export function DeviceEditorForm({
  assignees,
  departments,
  device,
  mode,
}: DeviceEditorFormProps) {
  const router = useRouter();
  const action = mode === "create" ? createDeviceAction : updateDeviceAction;
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const isActive = device?.isActive ?? true;

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo]);

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <span className={styles.eyebrow}>
              {mode === "create" ? "Yeni Cihaz" : "Cihaz Duzenleme"}
            </span>
            <h1>
              {mode === "create"
                ? "Demo cihaz envanteri kaydi olustur"
                : `${device?.assetTag ?? "Cihaz"} kaydini guncelle`}
            </h1>
          </div>
          <Link
            href={device ? `/devices/${device.id}` : "/devices"}
            className={styles.headerLink}
          >
            {device ? "Detay sayfasina don" : "Envantere don"}
          </Link>
        </div>
        <p>
          QR token otomatik uretilir; ham token, seri numarasi, IP veya MAC gibi
          hassas alanlar kullanicidan manuel beklenmez.
        </p>
      </header>

      <form action={formAction} className={styles.form}>
        {mode === "edit" && device ? (
          <input type="hidden" name="deviceId" value={device.id} />
        ) : null}
        {isActive ? <input type="hidden" name="isActive" value="on" /> : null}

        <div className={styles.infoCard}>
          <strong>Zorunlu alanlar</strong>
          <p>
            Asset tag, cihaz tipi, marka ve model alanlari zorunludur. Tum degerler
            demo veya prototip amacina uygun olmalidir.
          </p>
        </div>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Asset Tag</span>
            <input
              type="text"
              name="assetTag"
              defaultValue={device?.assetTag ?? ""}
              placeholder="DEMO-DEV-001"
              required
            />
            <small className={styles.fieldHint}>
              Zorunlu. Tekil ve kolay ayirt edilebilir demo etiketi kullanin.
            </small>
          </label>

          <label className={styles.field}>
            <span>Cihaz Tipi</span>
            <select
              name="deviceType"
              defaultValue={device?.deviceType ?? "desktop"}
            >
              {deviceTypeOptions.map((deviceType) => (
                <option key={deviceType} value={deviceType}>
                  {deviceTypeLabels[deviceType]}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Marka</span>
            <input
              type="text"
              name="brand"
              defaultValue={device?.brand ?? ""}
              placeholder="DemoTech"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Model</span>
            <input
              type="text"
              name="model"
              defaultValue={device?.model ?? ""}
              placeholder="OfficeStation A1"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Seri Numarasi</span>
            <input
              type="text"
              name="serialNumber"
              defaultValue={device?.serialNumber ?? ""}
              placeholder="DEMO-SN-1001"
            />
            <small className={styles.fieldHint}>
              Gercek seri numarasi yerine acik demo metni kullanin.
            </small>
          </label>

          <label className={styles.field}>
            <span>Departman</span>
            <select
              name="departmentId"
              defaultValue={device?.departmentId ?? ""}
            >
              <option value="">Departman secilmedi</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Cihazi Kullanan Personel</span>
            <select
              name="assignedUserId"
              defaultValue={device?.assignedUserId ?? ""}
            >
              <option value="">Atama yok</option>
              {assignees.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} - {roleLabels[user.role]}
                </option>
              ))}
            </select>
            <small className={styles.fieldHint}>
              Bu alan cihazin zimmetli veya cihazi kullanan personelini belirtir.
              Ticket uzerindeki teknik atama bilgisinden ayridir.
            </small>
          </label>

          <label className={styles.field}>
            <span>Durum</span>
            <select name="status" defaultValue={device?.status ?? "active"}>
              {deviceStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {deviceStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Satin Alma Tarihi</span>
            <input
              type="date"
              name="purchaseDate"
              defaultValue={device?.purchaseDate ?? ""}
            />
          </label>

          <label className={styles.field}>
            <span>Garanti Bitis Tarihi</span>
            <input
              type="date"
              name="warrantyEndDate"
              defaultValue={device?.warrantyEndDate ?? ""}
            />
            <small className={styles.fieldHint}>
              Garanti bitisi satin alma tarihinden once olamaz.
            </small>
          </label>

          <label className={styles.field}>
            <span>Isletim Sistemi</span>
            <input
              type="text"
              name="operatingSystem"
              defaultValue={device?.operatingSystem ?? ""}
              placeholder="Windows 11 Pro"
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>Notlar</span>
          <textarea
            name="notes"
            rows={5}
            defaultValue={device?.notes ?? ""}
            placeholder="Cihaz durumu, teslim notu veya prototip aciklamasi."
          />
        </label>

        <div className={styles.infoCard}>
          <strong>Kayit aktifligi</strong>
          <p>
            {isActive
              ? "Bu cihaz aktif durumda kaydedilecektir. Pasife alma islemi icin detay ekranindaki onayli akisi kullanin."
              : "Bu cihaz kaydi su anda pasif. Tekrar aktiflestirme bu asamada form uzerinden acilmadi."}
          </p>
        </div>

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

        <div className={styles.actions}>
          <button type="submit" className={styles.primaryButton} disabled={pending}>
            {pending
              ? mode === "create"
                ? "Kayit olusturuluyor..."
                : "Kayit guncelleniyor..."
              : mode === "create"
                ? "Cihazi Kaydet"
                : "Degisiklikleri Kaydet"}
          </button>
          <Link
            href={device ? `/devices/${device.id}` : "/devices"}
            className={styles.secondaryButton}
          >
            Vazgec
          </Link>
        </div>
      </form>
    </section>
  );
}
