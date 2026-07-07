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
        title="Cihaz detayi su anda yuklenemedi"
        description="Cihaz kaydi okunurken bir sorun olustu. Supabase erisimini kontrol edip sayfayi yenileyin."
        action={
          <Link href="/devices" className={styles.backLink}>
            Cihaz listesine don
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
            Cihaz listesine don
          </Link>

          <div className={styles.heroActions}>
            <Link href={`/devices/${device.id}/edit`} className={styles.secondaryLink}>
              Duzenle
            </Link>
            <Link href={`/devices/${device.id}/qr`} className={styles.primaryLink}>
              QR Onizleme
            </Link>
          </div>
        </div>

        <div className={styles.heroHeader}>
          <div>
            <span className={styles.eyebrow}>Cihaz Detayi</span>
            <h1>{device.assetTag}</h1>
            <p>
              {deviceTypeLabels[device.deviceType]} - {device.brand} {device.model}
            </p>
            {!device.isActive ? (
              <p className={styles.retiredNote}>
                Bu cihaz kaydi pasif durumdadir. Yeni kullanim veya aktif teslim
                senaryosu icin uygun degildir.
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
          <h2>Cihaz Ozeti</h2>
          <dl className={styles.detailList}>
            <div>
              <dt>Asset Tag</dt>
              <dd>{device.assetTag}</dd>
            </div>
            <div>
              <dt>QR Token Ozeti</dt>
              <dd>{getQrTokenPreview(device.qrToken)}</dd>
            </div>
            <div>
              <dt>Cihaz Tipi</dt>
              <dd>{deviceTypeLabels[device.deviceType]}</dd>
            </div>
            <div>
              <dt>Marka / Model</dt>
              <dd>
                {device.brand} {device.model}
              </dd>
            </div>
            <div>
              <dt>Seri Numarasi</dt>
              <dd>{getMaskedSerialNumber(device.serialNumber)}</dd>
            </div>
            <div>
              <dt>Durum</dt>
              <dd>{deviceStatusLabels[device.status]}</dd>
            </div>
            <div>
              <dt>Departman</dt>
              <dd>{device.departmentName ?? "Atanmadi"}</dd>
            </div>
            <div>
              <dt>Cihazi Kullanan Personel</dt>
              <dd>{device.assignedUserName ?? "Atanmadi"}</dd>
            </div>
            <div>
              <dt>Satin Alma Tarihi</dt>
              <dd>
                {device.purchaseDate
                  ? formatDeviceDate(device.purchaseDate)
                  : "Belirtilmedi"}
              </dd>
            </div>
            <div>
              <dt>Garanti Bitis Tarihi</dt>
              <dd>
                {device.warrantyEndDate
                  ? formatDeviceDate(device.warrantyEndDate)
                  : "Belirtilmedi"}
              </dd>
            </div>
            <div>
              <dt>Isletim Sistemi</dt>
              <dd>{device.operatingSystem ?? "Belirtilmedi"}</dd>
            </div>
            <div>
              <dt>Olusturan</dt>
              <dd>{device.createdByName ?? "Belirsiz"}</dd>
            </div>
            <div>
              <dt>Olusturma</dt>
              <dd>{formatDeviceDateTime(device.createdAt)}</dd>
            </div>
            <div>
              <dt>Son Guncelleme</dt>
              <dd>{formatDeviceDateTime(device.updatedAt)}</dd>
            </div>
          </dl>
        </article>

        <article className={styles.card}>
          <h2>Guvenli QR Yaklasimi</h2>
          <p className={styles.helperText}>
            Bu detay ekraninda ham QR token tam haliyle gosterilmez. QR sayfasinda
            uretilen payload yalnizca korumali cihaz route&apos;una yonelik opak token
            bilgisini icerir; seri numarasi, IP, MAC veya kullanici adi tasinmaz.
          </p>
          <dl className={styles.detailList}>
            <div>
              <dt>Payload Modeli</dt>
              <dd>TBT-DEVICE:&lt;opaque-token&gt;</dd>
            </div>
            <div>
              <dt>Kullanan Personel Notu</dt>
              <dd>
                Cihaz uzerindeki personel bilgisi, ticket kaydinda gorev alan teknik
                personelden ayridir.
              </dd>
            </div>
            <div>
              <dt>Kayit Durumu</dt>
              <dd>{device.isActive ? "Aktif cihaz kaydi" : "Pasif cihaz kaydi"}</dd>
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
              <span className={styles.eyebrow}>Ilgili Ticketlar</span>
              <h2>Cihazla iliskili kayitlar</h2>
            </div>
          </div>

          {relatedTickets.length === 0 ? (
            <p className={styles.helperText}>
              Bu cihazla iliskili ticket bulunmuyor.
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
              <span className={styles.eyebrow}>Bakim Gecmisi</span>
              <h2>Kayitli islemler</h2>
            </div>
          </div>

          {maintenanceRecords.length === 0 ? (
            <p className={styles.helperText}>
              Bu cihaz icin henuz bakim kaydi bulunmuyor.
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
                    <p className={styles.helperText}>Parca / not: {record.partsUsed}</p>
                  ) : null}
                  {record.relatedTicket ? (
                    <Link
                      href={`/tickets/${record.relatedTicket.id}`}
                      className={styles.ticketLink}
                    >
                      Ilgili ticket: #{record.relatedTicket.ticketNumber} -{" "}
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
