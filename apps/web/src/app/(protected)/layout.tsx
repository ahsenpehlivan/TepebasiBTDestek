import { redirect } from "next/navigation";

import { PanelShell } from "@/components/layout/panel-shell";
import { getAuthState, isPanelRole } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const authState = await getAuthState();

  if (authState.status === "anonymous") {
    redirect("/login");
  }

  if (authState.status === "missing_profile") {
    redirect("/auth-error");
  }

  if (authState.status === "inactive") {
    redirect("/access-denied");
  }

  if (!authState.profile || !isPanelRole(authState.profile.role)) {
    redirect("/access-denied");
  }

  return <PanelShell profile={authState.profile}>{children}</PanelShell>;
}
