import Link from "next/link";
import { notFound } from "next/navigation";

import { DeviceDeactivateForm } from "@/components/devices/device-deactivate-form";
import { DeviceMaintenanceForm } from "@/components/devices/device-maintenance-form";
import { StateCard } from "@/components/ui/state-card";
import {
  deviceStatusLabels,
  deviceTypeLabels,
  maintenanceTypeLabels,
} from "@/lib/constants/device-labels";
import { ticketPriorityLabels, ticketStatusLabels } from "@/lib/constants/ticket-labels";
import {
  formatCurrency,
  formatDeviceDate,
  formatDeviceDateTime,
  getMaskedSerialNumber,
  getQrTokenPreview,
} from "@/lib/devices/formatters";
import { loadDeviceDetail } from "@/lib/devices/queries";

import styles from "./device-detail.module.css";

type DeviceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function StatusBadge({
  kind,
  value,
  label,
}: {
  kind: "status" | "active";
  value: string;
  label: string;
}) {
  return (
    <div className={styles.badgeWrap}>
      <span className={styles.metaLabel}>
        {kind === "status" ? "Durum" : "Kayit"}
      </span>
      <span className={styles.badge} data-kind={kind} data-value={value}>
        {label}
      </span>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function DeviceDetailPage({
  params,
}: DeviceDetailPageProps) {
  const { id } = await params;
  const { device, relatedTickets, maintenanceRecords, hasError } =
    await loadDeviceDetail(id);

  if (hasError) {
    return (
      <StateCard
        tone="error"
        title="Cihaz detayı şu anda açılamadı"
        description="Cihaz kaydı geçici olarak okunamadı. Biraz sonra sayfayı yenileyerek tekrar deneyin."
        action={
          <Link href="/devices" className={styles.backLink}>
            Cihaz listesine dön
          </Link>
        }
      />
    );
  }

  if (!device) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <section className={styles.heroCard}>
        <div className={styles.topBar}>
          <Link href="/devices" className={styles.backLink}>
            Cihaz listesine dön
          </Link>

          <div className={styles.heroActions}>
            <Link href={`/devices/${device.id}/edit`} className={styles.secondaryLink}>
              Düzenle
            </Link>
            <Link href={`/devices/${device.id}/qr`} className={styles.primaryLink}>
              QR Önizleme
            </Link>
          </div>
        </div>

        <div className={styles.heroHeader}>
          <div>
            <span className={styles.eyebrow}>Cihaz Detayı</span>
            <h1>{device.assetTag}</h1>
            <p>
              {deviceTypeLabels[device.deviceType]} - {device.brand} {device.model}
            </p>
            {!device.isActive ? (
              <p className={styles.retiredNote}>
                Bu cihaz kaydı pasif durumdadır. Yeni kullanım veya aktif teslim
                senaryosu için uygun değildir.
              </p>
            ) : null}
          </div>

          <div className={styles.badgeRow}>
            <StatusBadge
              kind="status"
              value={device.status}
              label={deviceStatusLabels[device.status]}
            />
            <StatusBadge
              kind="active"
              value={device.isActive ? "true" : "false"}
              label={device.isActive ? "Aktif" : "Pasif"}
            />
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
              <h2>Cihaz Özeti</h2>
          <dl className={styles.detailList}>
            <div>
              <dt>Demirbaş Kodu</dt>
              <dd>{device.assetTag}</dd>
            </div>
            <div>
              <dt>QR Token Özeti</dt>
              <dd>{getQrTokenPreview(device.qrToken)}</dd>
            </div>
            <div>
              <dt>Cihaz Türü</dt>
              <dd>{deviceTypeLabels[device.deviceType]}</dd>
            </div>
            <div>
              <dt>Marka / Model</dt>
              <dd>
                {device.brand} {device.model}
              </dd>
            </div>
            <div>
              <dt>Seri Numarası</dt>
              <dd>{getMaskedSerialNumber(device.serialNumber)}</dd>
            </div>
            <div>
              <dt>Durum</dt>
              <dd>{deviceStatusLabels[device.status]}</dd>
            </div>
            <div>
              <dt>Birim</dt>
              <dd>{device.departmentName ?? "Atanmadı"}</dd>
            </div>
            <div>
              <dt>Zimmetli Personel</dt>
              <dd>{device.assignedUserName ?? "Atanmadı"}</dd>
            </div>
            <div>
              <dt>Satın Alma Tarihi</dt>
              <dd>
                {device.purchaseDate
                  ? formatDeviceDate(device.purchaseDate)
                  : "Belirtilmedi"}
              </dd>
            </div>
            <div>
              <dt>Garanti Bitiş Tarihi</dt>
              <dd>
                {device.warrantyEndDate
                  ? formatDeviceDate(device.warrantyEndDate)
                  : "Belirtilmedi"}
              </dd>
            </div>
            <div>
              <dt>İşletim Sistemi</dt>
              <dd>{device.operatingSystem ?? "Belirtilmedi"}</dd>
            </div>
            <div>
              <dt>Oluşturan</dt>
              <dd>{device.createdByName ?? "Belirsiz"}</dd>
            </div>
            <div>
              <dt>Oluşturma</dt>
              <dd>{formatDeviceDateTime(device.createdAt)}</dd>
            </div>
            <div>
              <dt>Son Güncelleme</dt>
              <dd>{formatDeviceDateTime(device.updatedAt)}</dd>
            </div>
          </dl>
        </article>

        <article className={styles.card}>
          <h2>Güvenli QR Yaklaşımı</h2>
          <p className={styles.helperText}>
            Bu detay ekranında ham QR token tam haliyle gösterilmez. QR sayfasında
            üretilen payload yalnızca korumalı cihaz route&apos;una yönelik opak token
            bilgisini içerir; seri numarası, IP, MAC veya kullanıcı adı taşınmaz.
          </p>
          <dl className={styles.detailList}>
            <div>
              <dt>Payload Modeli</dt>
              <dd>TBT-DEVICE:&lt;opaque-token&gt;</dd>
            </div>
            <div>
              <dt>Zimmetli Personel Notu</dt>
              <dd>
                Cihaz üzerindeki personel bilgisi, talep kaydında görev alan teknik
                personelden ayrıdır.
              </dd>
            </div>
            <div>
              <dt>Kayıt Durumu</dt>
              <dd>{device.isActive ? "Aktif cihaz kaydı" : "Pasif cihaz kaydı"}</dd>
            </div>
            <div>
              <dt>Notlar</dt>
              <dd>{device.notes ?? "Ek not bulunmuyor."}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>İlgili Talepler</span>
              <h2>Cihazla ilişkili talepler</h2>
            </div>
          </div>

          {relatedTickets.length === 0 ? (
            <p className={styles.helperText}>
              Bu cihazla ilişkili talep bulunmuyor.
            </p>
          ) : (
            <div className={styles.stack}>
              {relatedTickets.map((ticket) => (
                <article key={ticket.id} className={styles.ticketCard}>
                  <div className={styles.ticketHeader}>
                    <Link href={`/tickets/${ticket.id}`} className={styles.ticketLink}>
                      #{ticket.ticketNumber} - {ticket.title}
                    </Link>
                    <span
                      className={styles.ticketBadge}
                      data-kind="status"
                      data-value={ticket.status}
                    >
                      {ticketStatusLabels[ticket.status]}
                    </span>
                  </div>
                  <div className={styles.ticketMeta}>
                    <span>{ticketPriorityLabels[ticket.priority]}</span>
                    <time>{formatDeviceDateTime(ticket.createdAt)}</time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className={styles.card}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Bakım Geçmişi</span>
              <h2>Kayıtlı işlemler</h2>
            </div>
          </div>

          {maintenanceRecords.length === 0 ? (
            <p className={styles.helperText}>
              Bu cihaz için henüz bakım kaydı bulunmuyor.
            </p>
          ) : (
            <div className={styles.stack}>
              {maintenanceRecords.map((record) => (
                <article key={record.id} className={styles.maintenanceCard}>
                  <div className={styles.ticketHeader}>
                    <strong>{maintenanceTypeLabels[record.maintenanceType]}</strong>
                    <time>{formatDeviceDateTime(record.performedAt)}</time>
                  </div>
                  <p>{record.description}</p>
                  <div className={styles.ticketMeta}>
                    <span>Uygulayan: {record.performedByName ?? "Belirsiz"}</span>
                    <span>Maliyet: {formatCurrency(record.cost)}</span>
                  </div>
                  {record.partsUsed ? (
                    <p className={styles.helperText}>Parça / not: {record.partsUsed}</p>
                  ) : null}
                  {record.relatedTicket ? (
                    <Link
                      href={`/tickets/${record.relatedTicket.id}`}
                      className={styles.ticketLink}
                    >
                      İlgili talep: #{record.relatedTicket.ticketNumber} -{" "}
                      {record.relatedTicket.title}
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className={styles.grid}>
        <DeviceMaintenanceForm
          deviceId={device.id}
          relatedTickets={relatedTickets}
        />
        <DeviceDeactivateForm deviceId={device.id} disabled={!device.isActive} />
      </section>
    </div>
  );
}
