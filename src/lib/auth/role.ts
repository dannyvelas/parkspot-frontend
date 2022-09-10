import type { Session } from "$lib/auth";
import { dashboard } from "$lib/navigation";
import { redirect } from "@sveltejs/kit";

export const onlyRole = (role: string, session: Session | undefined): Session => {
  if (!session) {
    throw redirect(307, "/login");
  } else if (session.user.role !== role) {
    throw redirect(307, dashboard(session.user));
  }

  return session;
};
