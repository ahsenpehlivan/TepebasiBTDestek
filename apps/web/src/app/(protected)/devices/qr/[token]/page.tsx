import { notFound, redirect } from "next/navigation";

import { findDeviceIdByQrToken } from "@/lib/devices/queries";

type DeviceQrTokenPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function DeviceQrTokenPage({
  params,
}: DeviceQrTokenPageProps) {
  const { token } = await params;
  const deviceId = await findDeviceIdByQrToken(token);

  if (!deviceId) {
    notFound();
  }

  redirect(`/devices/${deviceId}`);
}
