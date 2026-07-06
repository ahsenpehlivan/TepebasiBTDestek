import { notFound } from "next/navigation";

import { DeviceEditorForm } from "@/components/devices/device-editor-form";
import {
  loadDeviceEditorOptions,
  loadDeviceFormRecord,
} from "@/lib/devices/queries";

type EditDevicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditDevicePage({ params }: EditDevicePageProps) {
  const { id } = await params;
  const [{ departments, assignees }, { device, hasError }] = await Promise.all([
    loadDeviceEditorOptions(),
    loadDeviceFormRecord(id),
  ]);

  if (hasError || !device) {
    notFound();
  }

  return (
    <DeviceEditorForm
      mode="edit"
      device={device}
      departments={departments}
      assignees={assignees}
    />
  );
}
