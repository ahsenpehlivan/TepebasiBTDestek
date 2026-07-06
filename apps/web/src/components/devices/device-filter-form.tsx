import Link from "next/link";

import {
  deviceStatusLabels,
  deviceStatusOptions,
  deviceTypeLabels,
  deviceTypeOptions,
} from "@/lib/constants/device-labels";
import type {
  DeviceListFilters,
} from "@/lib/devices/queries";
import type { DepartmentRecord } from "@/types/domain";

import styles from "./device-filter-form.module.css";

type DeviceFilterFormProps = {
  departments: Pick<DepartmentRecord, "id" | "name">[];
  filters: DeviceListFilters;
};

export function DeviceFilterForm({
  departments,
  filters,
}: DeviceFilterFormProps) {
  return (
    <form className={styles.form} action="/devices">
      <div className={styles.fieldGroup}>
        <label className={styles.field}>
          <span>Arama</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.query}
            placeholder="Asset tag, marka veya model"
          />
        </label>

        <label className={styles.field}>
          <span>Cihaz Tipi</span>
          <select name="type" defaultValue={filters.deviceType}>
            <option value="all">Tum tipler</option>
            {deviceTypeOptions.map((deviceType) => (
              <option key={deviceType} value={deviceType}>
                {deviceTypeLabels[deviceType]}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Durum</span>
          <select name="status" defaultValue={filters.status}>
            <option value="all">Tum durumlar</option>
            {deviceStatusOptions.map((status) => (
              <option key={status} value={status}>
                {deviceStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Departman</span>
          <select name="department" defaultValue={filters.departmentId}>
            <option value="all">Tum departmanlar</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.primaryButton}>
          Filtrele
        </button>
        <Link href="/devices" className={styles.secondaryButton}>
          Temizle
        </Link>
      </div>
    </form>
  );
}
