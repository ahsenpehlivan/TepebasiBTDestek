import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AppRole,
  AuthState,
  AuthenticatedProfile,
} from "@/types/domain";

type ProfileRow = {
  id: string;
  full_name: string;
  role: AppRole;
  department_id: string | null;
  job_title: string | null;
  is_active: boolean;
};

type DepartmentRow = {
  id: string;
  name: string;
  code: string;
};

export function isPanelRole(role: AppRole) {
  return role === "technician" || role === "admin";
}

export function getPostLoginPath(role: AppRole) {
  return isPanelRole(role) ? "/dashboard" : "/access-denied";
}

function mapProfile(
  profileRow: ProfileRow,
  email: string | null,
  department: DepartmentRow | null,
): AuthenticatedProfile {
  return {
    id: profileRow.id,
    email,
    fullName: profileRow.full_name,
    role: profileRow.role,
    departmentId: profileRow.department_id,
    departmentName: department?.name ?? null,
    departmentCode: department?.code ?? null,
    jobTitle: profileRow.job_title,
    isActive: profileRow.is_active,
  };
}

export async function getAuthState(
  existingSupabase?: SupabaseClient,
): Promise<AuthState> {
  const supabase = existingSupabase ?? (await createSupabaseServerClient());
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "anonymous",
      userId: null,
      email: null,
      profile: null,
    };
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role, department_id, job_title, is_active")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    throw new Error(
      "Kullanici profili yuklenemedi. Supabase profil kaydini ve RLS kurallarini kontrol edin.",
    );
  }

  if (!profileRow) {
    return {
      status: "missing_profile",
      userId: user.id,
      email: user.email ?? null,
      profile: null,
    };
  }

  let department: DepartmentRow | null = null;

  if (profileRow.department_id) {
    const { data: departmentRow } = await supabase
      .from("departments")
      .select("id, name, code")
      .eq("id", profileRow.department_id)
      .maybeSingle<DepartmentRow>();

    department = departmentRow ?? null;
  }

  const profile = mapProfile(profileRow, user.email ?? null, department);

  return {
    status: profile.isActive ? "authenticated" : "inactive",
    userId: user.id,
    email: user.email ?? null,
    profile,
  };
}
