import type {
  DeviceStatus,
  DeviceType,
  MaintenanceType,
} from "@/types/domain";

export const deviceTypeLabels: Record<DeviceType, string> = {
  desktop: "Masaustu",
  laptop: "Dizustu",
  monitor: "Monitor",
  printer: "Yazici",
  scanner: "Tarayici",
  network_device: "Ag Cihazi",
  tablet: "Tablet",
  phone: "Telefon",
  other: "Diger",
};

export const deviceStatusLabels: Record<DeviceStatus, string> = {
  active: "Aktif",
  in_repair: "Bakimda",
  spare: "Yedek",
  retired: "Pasif",
  lost: "Kayip",
};

export const maintenanceTypeLabels: Record<MaintenanceType, string> = {
  inspection: "Kontrol",
  repair: "Onarim",
  upgrade: "Yukseltme",
  component_replacement: "Parca Degisimi",
  software_installation: "Yazilim Kurulumu",
  other: "Diger",
};

export const deviceTypeOptions: DeviceType[] = [
  "desktop",
  "laptop",
  "monitor",
  "printer",
  "scanner",
  "network_device",
  "tablet",
  "phone",
  "other",
];

export const deviceStatusOptions: DeviceStatus[] = [
  "active",
  "in_repair",
  "spare",
  "retired",
  "lost",
];

export const maintenanceTypeOptions: MaintenanceType[] = [
  "inspection",
  "repair",
  "upgrade",
  "component_replacement",
  "software_installation",
  "other",
];
