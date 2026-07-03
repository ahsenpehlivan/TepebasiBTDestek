export type StatTone = "accent" | "success" | "warning" | "neutral";

export type StatItem = {
  label: string;
  value: string;
  detail: string;
  tone: StatTone;
};

export type SupportRequest = {
  id: string;
  requester: string;
  unit: string;
  category: string;
  priority: "Düşük" | "Orta" | "Yüksek";
  status: string;
  updatedAt: string;
};

export type QuickAction = {
  label: string;
  description: string;
  href: string;
};

export type NavigationItem = {
  label: string;
  href: string;
};
