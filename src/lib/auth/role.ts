import type { Session } from "$lib/auth/session";
import { redirect } from "@sveltejs/kit";

export const onlyRole = (role: string, session: Session | undefined): Session => {
  if (!session) {
    redirect(307, "/login");
  } else if (session.user.role !== role) {
    redirect(307, "/dashboard");
  }

  return session;
};
