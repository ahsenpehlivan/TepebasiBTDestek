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
        <div className={styles.header}>
          <span className={styles.eyebrow}>QR Onizleme</span>
          <h1>{device.assetTag}</h1>
          <p>
            {deviceTypeLabels[device.deviceType]} - {device.brand} {device.model}
          </p>
        </div>

        <div className={styles.notice}>
          Bu QR yalnizca demo/prototip amaclidir. Icerikte gercek seri numarasi,
          IP, MAC veya kullanici bilgisi bulunmaz.
        </div>

        <div className={styles.qrWrap}>
          <div
            className={styles.qrFrame}
            dangerouslySetInnerHTML={{ __html: qrMarkup }}
          />
        </div>

        <dl className={styles.detailList}>
          <div>
            <dt>Kullanim</dt>
            <dd>
              Sunum veya demo sirasinda cihaz etiketini gostermek ve korumali route
              mantigini anlatmak icin kullanilir.
            </dd>
          </div>
          <div>
            <dt>Payload</dt>
            <dd>{payload}</dd>
          </div>
          <div>
            <dt>QR Token Ozeti</dt>
            <dd>{getQrTokenPreview(device.qrToken)}</dd>
          </div>
          <div>
            <dt>Yazdirma Notu</dt>
            <dd>
              Yazdirma gorunumunde ust arac cubugu gizlenir ve merkezde tek bir QR
              karti birakilir.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
