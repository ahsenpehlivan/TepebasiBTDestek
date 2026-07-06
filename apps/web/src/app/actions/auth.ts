"use server";

import { redirect } from "next/navigation";

import { getAuthState, getPostLoginPath } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  error: string | null;
};

function readFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = readFormValue(formData.get("email")).trim().toLowerCase();
  const password = readFormValue(formData.get("password")).trim();

  if (!email || !password) {
    return {
      error: "E-posta ve parola alanlari zorunludur.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: "E-posta veya parola hatali. Lutfen demo hesap bilgilerini kontrol edin.",
    };
  }

  const authState = await getAuthState(supabase);

  if (authState.status === "missing_profile") {
    redirect("/auth-error");
  }

  if (authState.status === "inactive") {
    redirect("/access-denied");
  }

  if (!authState.profile) {
    return {
      error: "Oturum dogrulandi ancak profil bilgisi cozumlenemedi. Lutfen tekrar deneyin.",
    };
  }

  redirect(getPostLoginPath(authState.profile.role));
}

export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  redirect("/login");
}
