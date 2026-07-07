import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

import { PrintButton } from "@/components/devices/print-button";
import { deviceTypeLabels } from "@/lib/constants/device-labels";
import {
  getDeviceQrPayload,
  getQrTokenPreview,
} from "@/lib/devices/formatters";
import { loadDeviceDetail } from "@/lib/devices/queries";

import styles from "./qr-preview.module.css";

type DeviceQrPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function DeviceQrPage({ params }: DeviceQrPageProps) {
  const { id } = await params;
  const { device, hasError } = await loadDeviceDetail(id);

  if (hasError || !device) {
    notFound();
  }

  const payload = getDeviceQrPayload(device.qrToken);
  const qrMarkup = await QRCode.toString(payload, {
    type: "svg",
    margin: 1,
    width: 240,
    color: {
      dark: "#142033",
      light: "#FFFFFF",
    },
  });

  return (
    <div className={styles.page}>
      <section className={styles.toolbar}>
        <Link href={`/devices/${device.id}`} className={styles.backLink}>
          Cihaz detayına dön
        </Link>
        <PrintButton />
      </section>

      <section className={styles.card}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>QR Önizleme</span>
          <h1>{device.assetTag}</h1>
          <p>
            {deviceTypeLabels[device.deviceType]} - {device.brand} {device.model}
          </p>
        </div>

        <div className={styles.notice}>
          Bu QR yalnızca demo kullanım içindir. İçerikte gerçek seri numarası, IP,
          MAC veya personel bilgisi bulunmaz.
        </div>

        <div className={styles.qrWrap}>
          <div
            className={styles.qrFrame}
            dangerouslySetInnerHTML={{ __html: qrMarkup }}
          />
        </div>

        <dl className={styles.detailList}>
          <div>
            <dt>Kullanım</dt>
            <dd>
              Sunum veya demo sırasında cihaz etiketini göstermek ve korumalı route
              mantığını anlatmak için kullanılır.
            </dd>
          </div>
          <div>
            <dt>Payload</dt>
            <dd>{payload}</dd>
          </div>
          <div>
            <dt>QR Token Özeti</dt>
            <dd>{getQrTokenPreview(device.qrToken)}</dd>
          </div>
          <div>
            <dt>Yazdırma Notu</dt>
            <dd>
              Yazdırma görünümünde üst araç çubuğu gizlenir ve merkezde tek bir QR
              kartı görünür.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
