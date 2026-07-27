"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthState, isPanelRole } from "@/lib/auth/server";
import {
  deviceStatusOptions,
  deviceTypeOptions,
  maintenanceTypeOptions,
} from "@/lib/constants/device-labels";
import { createClient } from "@/lib/supabase/server";
import type {
  DeviceStatus,
  DeviceType,
  MaintenanceType,
} from "@/types/domain";

export type DeviceActionState = {
  error: string | null;
  success: string | null;
  redirectTo?: string | null;
};

const emptyActionState: DeviceActionState = {
  error: null,
  success: null,
  redirectTo: null,
};

function successState(
  success: string,
  redirectTo?: string,
): DeviceActionState {
  return {
    error: null,
    success,
    redirectTo: redirectTo ?? null,
  };
}

function errorState(error: string): DeviceActionState {
  return {
    error,
    success: null,
    redirectTo: null,
  };
}

function readFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalValue(value: FormDataEntryValue | null) {
  const resolved = readFormValue(value);
  return resolved || null;
}

function readCheckboxValue(value: FormDataEntryValue | null) {
  return value === "on";
}

function readOptionalNumber(value: FormDataEntryValue | null) {
  const resolved = readFormValue(value);

  if (!resolved) {
    return null;
  }

  const parsed = Number(resolved.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

async function requirePanelOperator() {
  const supabase = await createClient();
  const authState = await getAuthState(supabase);

  if (!authState.profile || !isPanelRole(authState.profile.role)) {
    return {
      supabase,
      authState,
      error: errorState(
        "Bu işlem yalnızca technician veya admin kullanıcılar tarafından yapılabilir.",
      ),
    };
  }

  return {
    supabase,
    authState,
    error: null,
  };
}

type DeviceMutationPayload = {
  asset_tag: string;
  device_type: DeviceType;
  brand: string;
  model: string;
  serial_number: string | null;
  department_id: string | null;
  assigned_user_id: string | null;
  status: DeviceStatus;
  purchase_date: string | null;
  warranty_end_date: string | null;
  operating_system: string | null;
  notes: string | null;
  is_active: boolean;
};

function validateDeviceMutation(formData: FormData) {
  const assetTag = readFormValue(formData.get("assetTag"));
  const deviceType = readFormValue(formData.get("deviceType")) as DeviceType;
  const brand = readFormValue(formData.get("brand"));
  const model = readFormValue(formData.get("model"));
  const serialNumber = readOptionalValue(formData.get("serialNumber"));
  const departmentId = readOptionalValue(formData.get("departmentId"));
  const assignedUserId = readOptionalValue(formData.get("assignedUserId"));
  const requestedStatus = readFormValue(formData.get("status")) as DeviceStatus;
  const purchaseDate = readOptionalValue(formData.get("purchaseDate"));
  const warrantyEndDate = readOptionalValue(formData.get("warrantyEndDate"));
  const operatingSystem = readOptionalValue(formData.get("operatingSystem"));
  const notes = readOptionalValue(formData.get("notes"));
  const isActive = readCheckboxValue(formData.get("isActive"));

  if (assetTag.length < 3) {
    return {
      payload: null,
      error: "Asset tag en az 3 karakter olmalidir.",
    };
  }

  if (!deviceTypeOptions.includes(deviceType)) {
    return {
      payload: null,
      error: "Geçerli bir cihaz tipi seçilmelidir.",
    };
  }

  if (brand.length < 2 || brand.length > 80) {
    return {
      payload: null,
      error: "Marka alani 2 ile 80 karakter arasinda olmalidir.",
    };
  }

  if (model.length < 1 || model.length > 120) {
    return {
      payload: null,
      error: "Model alani bos birakilamaz ve 120 karakteri gecemez.",
    };
  }

  if (!deviceStatusOptions.includes(requestedStatus)) {
    return {
      payload: null,
      error: "Geçerli bir cihaz durumu seçilmelidir.",
    };
  }

  if (serialNumber && serialNumber.length < 3) {
    return {
      payload: null,
      error: "Seri numarasi girilecekse en az 3 karakter olmalidir.",
    };
  }

  if (purchaseDate && warrantyEndDate && warrantyEndDate < purchaseDate) {
    return {
      payload: null,
      error: "Garanti bitiş tarihi satın alma tarihinden önce olamaz.",
    };
  }

  const status = !isActive && requestedStatus === "active"
    ? "retired"
    : requestedStatus;

  return {
    payload: {
      asset_tag: assetTag,
      device_type: deviceType,
      brand,
      model,
      serial_number: serialNumber,
      department_id: departmentId,
      assigned_user_id: isActive ? assignedUserId : null,
      status,
      purchase_date: purchaseDate,
      warranty_end_date: warrantyEndDate,
      operating_system: operatingSystem,
      notes,
      is_active: isActive,
    } satisfies DeviceMutationPayload,
    error: null,
  };
}

function mapDeviceMutationError(message: string) {
  if (message.includes("devices_asset_tag_key")) {
    return "Bu asset tag zaten kayıtlı. Lütfen başka bir envanter etiketi girin.";
  }

  if (message.includes("devices_serial_number_key")) {
    return "Bu seri numarası zaten kullanılıyor. Demo için farklı bir değer deneyin.";
  }

  if (message.includes("devices_warranty_after_purchase")) {
    return "Garanti bitiş tarihi satın alma tarihinden önce olamaz.";
  }

  return "Cihaz kaydı tamamlanamadı. Alanları kontrol edip tekrar deneyin.";
}

function mapMaintenanceMutationError(message: string) {
  if (message.includes("cost")) {
    return "Bakım maliyeti negatif olamaz.";
  }

  if (message.includes("description")) {
    return "Bakım açıklaması en az 3 karakter olmalıdır.";
  }

  return "Bakım kaydı eklenemedi. Yetki ve alan bilgilerini kontrol edip tekrar deneyin.";
}

function revalidateDevicePaths(deviceId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/devices");

  if (deviceId) {
    revalidatePath(`/devices/${deviceId}`);
    revalidatePath(`/devices/${deviceId}/edit`);
    revalidatePath(`/devices/${deviceId}/qr`);
  }
}

export async function createDeviceAction(
  previousState: DeviceActionState = emptyActionState,
  formData: FormData,
): Promise<DeviceActionState> {
  void previousState;
  const context = await requirePanelOperator();

  if (context.error) {
    return context.error;
  }

  const validated = validateDeviceMutation(formData);

  if (validated.error || !validated.payload) {
    return errorState(validated.error ?? "Cihaz verisi dogrulanamadi.");
  }

  const { supabase, authState } = context;
  const profile = authState.profile;

  if (!profile) {
    return errorState(
      "Bu işlem yalnızca technician veya admin kullanıcılar tarafından yapılabilir.",
    );
  }

  const { error } = await supabase
    .from("devices")
    .insert({
      ...validated.payload,
      created_by: profile.id,
    });

  if (error) {
    return errorState(mapDeviceMutationError(error.message));
  }

  const { data: createdDevice, error: lookupError } = await supabase
    .from("devices")
    .select("id")
    .eq("asset_tag", validated.payload.asset_tag)
    .maybeSingle<{ id: string }>();

  if (lookupError || !createdDevice) {
    return errorState(
      "Cihaz kaydı oluştu ancak detay adresi okunamadı. Liste ekranını yenileyip kaydı kontrol edin.",
    );
  }

  revalidateDevicePaths(createdDevice.id);
  redirect(`/devices/${createdDevice.id}`);
}

export async function updateDeviceAction(
  previousState: DeviceActionState = emptyActionState,
  formData: FormData,
): Promise<DeviceActionState> {
  void previousState;
  const deviceId = readFormValue(formData.get("deviceId"));

  if (!deviceId) {
    return errorState("Güncellenecek cihaz kaydı bulunamadı.");
  }

  const context = await requirePanelOperator();

  if (context.error) {
    return context.error;
  }

  const validated = validateDeviceMutation(formData);

  if (validated.error || !validated.payload) {
    return errorState(validated.error ?? "Cihaz verisi dogrulanamadi.");
  }

  const { supabase } = context;
  const { error } = await supabase
    .from("devices")
    .update(validated.payload)
    .eq("id", deviceId);

  if (error) {
    return errorState(mapDeviceMutationError(error.message));
  }

  revalidateDevicePaths(deviceId);
  redirect(`/devices/${deviceId}`);
}

export async function deactivateDeviceAction(
  previousState: DeviceActionState = emptyActionState,
  formData: FormData,
): Promise<DeviceActionState> {
  void previousState;
  const deviceId = readFormValue(formData.get("deviceId"));
  const confirmation = readFormValue(formData.get("confirmation"));

  if (!deviceId) {
    return errorState("Pasife alinacak cihaz bulunamadi.");
  }

  if (confirmation !== "PASIFE_AL") {
    return errorState(
      "Pasife alma onayi icin ilgili alana PASIFE_AL yazilmalidir.",
    );
  }

  const context = await requirePanelOperator();

  if (context.error) {
    return context.error;
  }

  const { supabase } = context;
  const { error } = await supabase
    .from("devices")
    .update({
      is_active: false,
      status: "retired",
      assigned_user_id: null,
    })
    .eq("id", deviceId);

  if (error) {
    return errorState("Cihaz pasife alınamadı. Kaydı kontrol edip tekrar deneyin.");
  }

  revalidateDevicePaths(deviceId);
  redirect(`/devices/${deviceId}`);
}

export async function createDeviceMaintenanceAction(
  previousState: DeviceActionState = emptyActionState,
  formData: FormData,
): Promise<DeviceActionState> {
  void previousState;
  const deviceId = readFormValue(formData.get("deviceId"));
  const maintenanceType = readFormValue(
    formData.get("maintenanceType"),
  ) as MaintenanceType;
  const description = readFormValue(formData.get("description"));
  const relatedTicketId = readOptionalValue(formData.get("relatedTicketId"));
  const cost = readOptionalNumber(formData.get("cost"));
  const partsUsed = readOptionalValue(formData.get("partsUsed"));

  if (!deviceId) {
    return errorState("Bakım kaydı için cihaz bilgisi eksik.");
  }

  if (!maintenanceTypeOptions.includes(maintenanceType)) {
    return errorState("Geçerli bir bakım tipi seçilmelidir.");
  }

  if (description.length < 3) {
    return errorState("Bakım açıklaması en az 3 karakter olmalıdır.");
  }

  if (cost !== null && Number.isNaN(cost)) {
    return errorState("Bakım maliyeti sayısal bir değer olmalıdır.");
  }

  if ((cost ?? 0) < 0) {
    return errorState("Bakım maliyeti negatif olamaz.");
  }

  const context = await requirePanelOperator();

  if (context.error) {
    return context.error;
  }

  const { supabase, authState } = context;
  const profile = authState.profile;

  if (!profile) {
    return errorState(
      "Bu işlem yalnızca technician veya admin kullanıcılar tarafından yapılabilir.",
    );
  }

  const { error } = await supabase.from("device_maintenance_records").insert({
    device_id: deviceId,
    ticket_id: relatedTicketId,
    maintenance_type: maintenanceType,
    description,
    performed_by: profile.id,
    cost: cost ?? 0,
    parts_used: partsUsed,
  });

  if (error) {
    return errorState(mapMaintenanceMutationError(error.message));
  }

  revalidateDevicePaths(deviceId);
  return successState("Bakım kaydı eklendi.");
}
