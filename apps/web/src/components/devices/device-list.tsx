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
                <th>Asset Tag</th>
                <th>Cihaz Tipi</th>
                <th>Marka / Model</th>
                <th>Departman</th>
                <th>Atanan Kullanici</th>
                <th>Durum</th>
                <th>Garanti Bitisi</th>
                <th>Kayit</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>
                    <Link href={`/devices/${device.id}`} className={styles.titleLink}>
                      {device.assetTag}
                    </Link>
                  </td>
                  <td>{getDeviceTypeLabel(device.deviceType)}</td>
                  <td>
                    {device.brand} {device.model}
                  </td>
                  <td>{device.departmentName ?? "Atanmadi"}</td>
                  <td>{device.assignedUserName ?? "Atanmadi"}</td>
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
          <article key={device.id} className={styles.deviceCard}>
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

            <dl className={styles.detailList}>
              <div>
                <dt>Departman</dt>
                <dd>{device.departmentName ?? "Atanmadi"}</dd>
              </div>
              <div>
                <dt>Atanan Kullanici</dt>
                <dd>{device.assignedUserName ?? "Atanmadi"}</dd>
              </div>
              <div>
                <dt>Garanti Bitisi</dt>
                <dd>
                  {device.warrantyEndDate
                    ? formatDeviceDate(device.warrantyEndDate)
                    : "Belirtilmedi"}
                </dd>
              </div>
              <div>
                <dt>Kayit Tarihi</dt>
                <dd>{formatDeviceDateTime(device.createdAt)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </>
  );
}
