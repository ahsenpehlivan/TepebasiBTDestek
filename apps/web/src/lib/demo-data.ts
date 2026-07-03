import type {
  NavigationItem,
  QuickAction,
  StatItem,
  SupportRequest,
} from "@/types/dashboard";

// All records in this file are fictional and exist only for prototype display.
export const dashboardStats: StatItem[] = [
  {
    label: "Açık Talepler",
    value: "12",
    detail: "Gün içinde izlenen toplam açık kayıt",
    tone: "accent",
  },
  {
    label: "Bekleyen Talepler",
    value: "5",
    detail: "Atama veya geri dönüş bekleyen kayıt",
    tone: "warning",
  },
  {
    label: "Kayıtlı Cihazlar",
    value: "148",
    detail: "Kurgusal envanterdeki aktif cihaz",
    tone: "neutral",
  },
  {
    label: "Bu Ay Tamamlanan",
    value: "27",
    detail: "Kurgusal veride kapanan destek işi",
    tone: "success",
  },
];

export const recentRequests: SupportRequest[] = [
  {
    id: "TD-1042",
    requester: "Ayşe K.",
    unit: "Kültür İşleri",
    category: "Yazıcı",
    priority: "Orta",
    status: "İnceleniyor",
    updatedAt: "Bugün 10:40",
  },
  {
    id: "TD-1041",
    requester: "Murat S.",
    unit: "Fen İşleri",
    category: "Ağ Erişimi",
    priority: "Yüksek",
    status: "Teknik Personele Atandı",
    updatedAt: "Bugün 09:15",
  },
  {
    id: "TD-1039",
    requester: "Elif D.",
    unit: "İnsan Kaynakları",
    category: "Bilgisayar",
    priority: "Düşük",
    status: "Bilgi Bekleniyor",
    updatedAt: "Dün 16:25",
  },
  {
    id: "TD-1038",
    requester: "Kemal T.",
    unit: "Destek Hizmetleri",
    category: "Tarayıcı",
    priority: "Orta",
    status: "Tamamlandı",
    updatedAt: "Dün 14:10",
  },
];

export const quickActions: QuickAction[] = [
  {
    label: "Yeni Talep",
    description: "Yeni bir teknik destek kaydı oluşturmak için ayrılmış alan.",
    href: "/dashboard",
  },
  {
    label: "Cihazlar",
    description: "Demo envanter ve bakım geçmişi ekranları için başlangıç noktası.",
    href: "/dashboard",
  },
  {
    label: "Kullanıcılar",
    description: "Rol bazlı kullanıcı yönetimi akışı için yer ayrılmıştır.",
    href: "/dashboard",
  },
  {
    label: "Raporlar",
    description: "İleriki aşamada çıktı ve özet raporlar için kullanılacaktır.",
    href: "/dashboard",
  },
];

export const dashboardNavigation: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Talepler", href: "/dashboard" },
  { label: "Cihazlar", href: "/dashboard" },
  { label: "Raporlar", href: "/dashboard" },
];
