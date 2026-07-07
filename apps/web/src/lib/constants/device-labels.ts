import type {
  DeviceStatus,
  DeviceType,
  MaintenanceType,
} from "@/types/domain";

export const deviceTypeLabels: Record<DeviceType, string> = {
  desktop: "Masaüstü",
  laptop: "Dizüstü",
  monitor: "Monitör",
  printer: "Yazıcı",
  scanner: "Tarayıcı",
  network_device: "Ağ Cihazı",
  tablet: "Tablet",
  phone: "Telefon",
  other: "Diğer",
};

export const deviceStatusLabels: Record<DeviceStatus, string> = {
  active: "Aktif",
  in_repair: "Bakımda",
  spare: "Yedek",
  retired: "Kullanım Dışı",
  lost: "Kayıp",
};

export const maintenanceTypeLabels: Record<MaintenanceType, string> = {
  inspection: "Kontrol",
  repair: "Onarım",
  upgrade: "Yükseltme",
  component_replacement: "Parça Değişimi",
  software_installation: "Yazılım Kurulumu",
  other: "Diğer",
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
