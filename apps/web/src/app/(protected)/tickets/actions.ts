"use server";

import { revalidatePath } from "next/cache";

import { getAuthState, isPanelRole } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { ticketStatusOptions } from "@/lib/constants/ticket-labels";
import type { TicketStatus } from "@/types/domain";

export type TicketActionState = {
  error: string | null;
  success: string | null;
};

function readFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

const initialSuccessState = (message: string): TicketActionState => ({
  error: null,
  success: message,
});

const initialErrorState = (message: string): TicketActionState => ({
  error: message,
  success: null,
});

function mapTicketMutationError(message: string) {
  if (message.includes("Invalid ticket status transition")) {
    return "Secilen durum gecisi izin verilen is akisina uymuyor.";
  }

  if (message.includes("requires an assigned technician or admin")) {
    return "Bu duruma gecmek icin once aktif bir technician veya admin atamasi yapin.";
  }

  if (message.includes("Assigned ticket user must be an active technician or admin")) {
    return "Atanan kullanici aktif technician veya admin olmalidir.";
  }

  if (message.includes("Employees cannot update tickets directly")) {
    return "Bu işlem yalnızca technician veya admin kullanıcılar için açıktır.";
  }

  return "İşlem tamamlanamadı. Ticket yetkilerini ve zorunlu alanları kontrol edip tekrar deneyin.";
}

async function requirePanelOperator() {
  const supabase = await createClient();
  const authState = await getAuthState(supabase);

  if (!authState.profile || !isPanelRole(authState.profile.role)) {
    return {
      supabase,
      authState,
      error: initialErrorState(
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

function revalidateTicketPaths(ticketId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${ticketId}`);
}

export async function assignTicketAction(
  _previousState: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const ticketId = readFormValue(formData.get("ticketId"));
  const assignedTo = readFormValue(formData.get("assignedTo"));

  if (!ticketId || !assignedTo) {
    return initialErrorState("Ticket ve atanan kullanici bilgisi zorunludur.");
  }

  const context = await requirePanelOperator();

  if (context.error) {
    return context.error;
  }

  const { supabase } = context;
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .select("id, status, assigned_to")
    .eq("id", ticketId)
    .maybeSingle<{ id: string; status: TicketStatus; assigned_to: string | null }>();

  if (ticketError || !ticket) {
    return initialErrorState("Ticket kaydı bulunamadı veya bu kayda erişim izni yok.");
  }

  const nextStatus = ticket.status === "open" ? "assigned" : ticket.status;
  const { error } = await supabase
    .from("tickets")
    .update({
      assigned_to: assignedTo,
      status: nextStatus,
    })
    .eq("id", ticketId);

  if (error) {
    return initialErrorState(mapTicketMutationError(error.message));
  }

  revalidateTicketPaths(ticketId);
  return initialSuccessState("Ticket atamasi guncellendi.");
}

export async function updateTicketStatusAction(
  _previousState: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const ticketId = readFormValue(formData.get("ticketId"));
  const nextStatus = readFormValue(formData.get("status")) as TicketStatus;

  if (!ticketId || !ticketStatusOptions.includes(nextStatus)) {
    return initialErrorState("Geçerli bir ticket durumu seçilmelidir.");
  }

  const context = await requirePanelOperator();

  if (context.error) {
    return context.error;
  }

  const { supabase } = context;
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .select("id, status, assigned_to")
    .eq("id", ticketId)
    .maybeSingle<{ id: string; status: TicketStatus; assigned_to: string | null }>();

  if (ticketError || !ticket) {
    return initialErrorState("Ticket kaydı bulunamadı veya bu kayda erişim izni yok.");
  }

  if (
    ["assigned", "in_progress", "waiting_user", "resolved", "closed"].includes(nextStatus) &&
    !ticket.assigned_to
  ) {
    return initialErrorState(
      "Bu duruma gecmek icin once ticket'a aktif bir technician veya admin atamasi yapin.",
    );
  }

  const { error } = await supabase
    .from("tickets")
    .update({
      status: nextStatus,
    })
    .eq("id", ticketId);

  if (error) {
    return initialErrorState(mapTicketMutationError(error.message));
  }

  revalidateTicketPaths(ticketId);
  return initialSuccessState("Ticket durumu guncellendi.");
}

export async function createTicketCommentAction(
  _previousState: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const ticketId = readFormValue(formData.get("ticketId"));
  const content = readFormValue(formData.get("content"));
  const isInternal = formData.get("isInternal") === "on";

  if (!ticketId || !content) {
    return initialErrorState("Yorum metni boş bırakılamaz.");
  }

  const context = await requirePanelOperator();

  if (context.error) {
    return context.error;
  }

  const { supabase, authState } = context;
  const profile = authState.profile;

  if (!profile) {
    return initialErrorState(
      "Bu işlem yalnızca technician veya admin kullanıcılar tarafından yapılabilir.",
    );
  }

  const { error } = await supabase.from("ticket_comments").insert({
    ticket_id: ticketId,
    author_id: profile.id,
    content,
    is_internal: isInternal,
  });

  if (error) {
    return initialErrorState(
      "Yorum eklenemedi. Erişim iznini ve yorum içeriğini kontrol edip tekrar deneyin.",
    );
  }

  revalidateTicketPaths(ticketId);
  return initialSuccessState(
    isInternal ? "İç not eklendi." : "Genel yorum eklendi.",
  );
}
