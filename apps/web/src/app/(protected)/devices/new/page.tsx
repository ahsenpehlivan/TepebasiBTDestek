import { DeviceEditorForm } from "@/components/devices/device-editor-form";
import { loadDeviceEditorOptions } from "@/lib/devices/queries";

export const dynamic = "force-dynamic";

export default async function NewDevicePage() {
  const { departments, assignees } = await loadDeviceEditorOptions();

  return (
    <DeviceEditorForm
      mode="create"
      departments={departments}
      assignees={assignees}
    />
  );
}
