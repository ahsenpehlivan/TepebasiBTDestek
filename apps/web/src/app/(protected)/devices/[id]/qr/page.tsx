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
          Cihaz detayina don
        </Link>
        <PrintButton />
      </section>

      <section className={styles.card}>
        <span className={styles.eyebrow}>QR Onizleme</span>
        <h1>{device.assetTag}</h1>
        <p>
          {deviceTypeLabels[device.deviceType]} - {device.brand} {device.model}
        </p>

        <div className={styles.qrWrap}>
          <div
            className={styles.qrFrame}
            dangerouslySetInnerHTML={{ __html: qrMarkup }}
          />
        </div>

        <dl className={styles.detailList}>
          <div>
            <dt>Payload</dt>
            <dd>{payload}</dd>
          </div>
          <div>
            <dt>QR Token Ozeti</dt>
            <dd>{getQrTokenPreview(device.qrToken)}</dd>
          </div>
          <div>
            <dt>Uyari</dt>
            <dd>
              Bu ekran yalnizca demo/prototip kullanim icindir. QR icinde seri
              numarasi, IP, MAC veya kullanici bilgisi bulunmaz.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
