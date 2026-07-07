import Link from "next/link";

import {
  formatDeviceDate,
  formatDeviceDateTime,
  getDeviceStatusLabel,
  getDeviceTypeLabel,
} from "@/lib/devices/formatters";
import type { DeviceListItem } from "@/types/domain";

import styles from "./device-list.module.css";

type DeviceListProps = {
  devices: DeviceListItem[];
};

function StatusBadge({ status }: { status: DeviceListItem["status"] }) {
  return (
    <span className={styles.badge} data-kind="status" data-value={status}>
      {getDeviceStatusLabel(status)}
    </span>
  );
}

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={styles.badge}
      data-kind="active"
      data-value={isActive ? "true" : "false"}
    >
      {isActive ? "Aktif" : "Pasif"}
    </span>
  );
}

export function DeviceList({ devices }: DeviceListProps) {
  return (
    <>
      <section className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Demirbaş Kodu</th>
                <th>Cihaz Türü</th>
                <th>Marka / Model</th>
                <th>Birim</th>
                <th>Zimmetli Personel</th>
                <th>Durum</th>
                <th>Garanti Bitişi</th>
                <th>Kayıt</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr
                  key={device.id}
                  className={styles.row}
                  data-inactive={device.isActive ? "false" : "true"}
                >
                  <td>
                    <Link href={`/devices/${device.id}`} className={styles.titleLink}>
                      {device.assetTag}
                    </Link>
                  </td>
                  <td>{getDeviceTypeLabel(device.deviceType)}</td>
                  <td>
                    {device.brand} {device.model}
                  </td>
                  <td>{device.departmentName ?? "Atanmadı"}</td>
                  <td>{device.assignedUserName ?? "Atanmadı"}</td>
                  <td>
                    <StatusBadge status={device.status} />
                  </td>
                  <td>
                    {device.warrantyEndDate
                      ? formatDeviceDate(device.warrantyEndDate)
                      : "Belirtilmedi"}
                  </td>
                  <td>
                    <ActiveBadge isActive={device.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.cardList}>
        {devices.map((device) => (
          <article
            key={device.id}
            className={styles.deviceCard}
            data-inactive={device.isActive ? "false" : "true"}
          >
            <div className={styles.cardHeader}>
              <Link href={`/devices/${device.id}`} className={styles.cardTitle}>
                {device.assetTag}
              </Link>
              <div className={styles.badgeRow}>
                <StatusBadge status={device.status} />
                <ActiveBadge isActive={device.isActive} />
              </div>
            </div>

            <p className={styles.deviceType}>{getDeviceTypeLabel(device.deviceType)}</p>
            <p className={styles.brandModel}>
              {device.brand} {device.model}
            </p>
            {!device.isActive ? (
              <p className={styles.inactiveNote}>
                Bu kayıt pasifleştirildi. Yeni atama veya aktif kullanım için uygun
                değildir.
              </p>
            ) : null}

            <dl className={styles.detailList}>
              <div>
                <dt>Birim</dt>
                <dd>{device.departmentName ?? "Atanmadı"}</dd>
              </div>
              <div>
                <dt>Zimmetli Personel</dt>
                <dd>{device.assignedUserName ?? "Atanmadı"}</dd>
              </div>
              <div>
                <dt>Garanti Bitişi</dt>
                <dd>
                  {device.warrantyEndDate
                    ? formatDeviceDate(device.warrantyEndDate)
                    : "Belirtilmedi"}
                </dd>
              </div>
              <div>
                <dt>Kayıt Tarihi</dt>
                <dd>{formatDeviceDateTime(device.createdAt)}</dd>
              </div>
            </dl>

            <Link href={`/devices/${device.id}`} className={styles.detailLink}>
              Detayı Gör
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
