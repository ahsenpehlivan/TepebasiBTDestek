import {
  deviceStatusLabels,
  deviceTypeLabels,
  maintenanceTypeLabels,
} from "@/lib/constants/device-labels";
import type {
  DeviceStatus,
  DeviceType,
  MaintenanceType,
} from "@/types/domain";

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("tr-TR", options).format(new Date(value));
}

export function formatDeviceDate(value: string) {
  return formatDate(value, {
    dateStyle: "medium",
  });
}

export function formatDeviceDateTime(value: string) {
  return formatDate(value, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value);
}

export function getDeviceTypeLabel(deviceType: DeviceType) {
  return deviceTypeLabels[deviceType];
}

export function getDeviceStatusLabel(status: DeviceStatus) {
  return deviceStatusLabels[status];
}

export function getMaintenanceTypeLabel(type: MaintenanceType) {
  return maintenanceTypeLabels[type];
}

export function normalizeSearchText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function getQrTokenPreview(token: string) {
  if (token.length <= 12) {
    return token;
  }

  return `${token.slice(0, 8)}...${token.slice(-6)}`;
}

export function getDeviceQrPayload(token: string) {
  return `TBT-DEVICE:${token}`;
}

export function getMaskedSerialNumber(serialNumber: string | null) {
  if (!serialNumber) {
    return "Belirtilmedi";
  }

  if (serialNumber.startsWith("DEMO-")) {
    return serialNumber;
  }

  if (serialNumber.length <= 6) {
    return `${serialNumber.slice(0, 2)}***`;
  }

  return `${serialNumber.slice(0, 3)}***${serialNumber.slice(-3)}`;
}
