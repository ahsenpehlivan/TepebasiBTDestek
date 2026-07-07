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
              {mode === "create" ? "Yeni Cihaz" : "Cihaz Düzenleme"}
            </span>
            <h1>
              {mode === "create"
                ? "Cihaz envanteri kaydı oluştur"
                : `${device?.assetTag ?? "Cihaz"} kaydını güncelle`}
            </h1>
          </div>
          <Link
            href={device ? `/devices/${device.id}` : "/devices"}
            className={styles.headerLink}
          >
            {device ? "Detay sayfasına dön" : "Envantere dön"}
          </Link>
        </div>
        <p>
          Bu form sade ve kontrollü veri girişi için hazırlandı. QR bilgisi otomatik
          üretilir; seri numarası, IP veya MAC gibi hassas alanlar için uygun veri
          kullanılmalıdır.
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
            Demirbaş kodu, cihaz türü, marka ve model alanları zorunludur.
          </p>
        </div>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Demirbaş Kodu</span>
            <input
              type="text"
              name="assetTag"
              defaultValue={device?.assetTag ?? ""}
              placeholder="BT-001"
              required
            />
            <small className={styles.fieldHint}>
              Zorunlu. Tekil ve kolay ayırt edilebilir bir demirbaş kodu kullanın.
            </small>
          </label>

          <label className={styles.field}>
            <span>Cihaz Türü</span>
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
              placeholder="Marka adı"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Model</span>
            <input
              type="text"
              name="model"
              defaultValue={device?.model ?? ""}
              placeholder="Model detayları"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Seri Numarası</span>
            <input
              type="text"
              name="serialNumber"
              defaultValue={device?.serialNumber ?? ""}
              placeholder="SN-1001"
            />
          </label>

          <label className={styles.field}>
            <span>Birim</span>
            <select
              name="departmentId"
              defaultValue={device?.departmentId ?? ""}
            >
              <option value="">Birim seçilmedi</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Zimmetli Personel</span>
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
              Bu alan cihazın zimmetli veya cihazı kullanan personelini belirtir.
              Talep üzerindeki teknik atama bilgisinden ayrıdır.
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
            <span>Satın Alma Tarihi</span>
            <input
              type="date"
              name="purchaseDate"
              defaultValue={device?.purchaseDate ?? ""}
            />
          </label>

          <label className={styles.field}>
            <span>Garanti Bitiş Tarihi</span>
            <input
              type="date"
              name="warrantyEndDate"
              defaultValue={device?.warrantyEndDate ?? ""}
            />
            <small className={styles.fieldHint}>
              Garanti bitişi satın alma tarihinden önce olamaz.
            </small>
          </label>

          <label className={styles.field}>
            <span>İşletim Sistemi</span>
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
            placeholder="Cihaz durumu, teslim notu veya ek açıklamalar."
          />
        </label>

        <div className={styles.infoCard}>
          <strong>Kayıt aktifliği</strong>
          <p>
            {isActive
              ? "Bu cihaz aktif durumda kaydedilecektir. Pasife alma işlemi için detay ekranındaki onaylı akışı kullanın."
              : "Bu cihaz kaydı şu anda pasif. Tekrar aktifleştirme bu aşamada form üzerinden açılmadı."}
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
                ? "Kayıt oluşturuluyor..."
                : "Kayıt güncelleniyor..."
              : mode === "create"
                ? "Cihazı Kaydet"
                : "Değişiklikleri Kaydet"}
          </button>
          <Link
            href={device ? `/devices/${device.id}` : "/devices"}
            className={styles.secondaryButton}
          >
            Vazgeç
          </Link>
        </div>
      </form>
    </section>
  );
}
