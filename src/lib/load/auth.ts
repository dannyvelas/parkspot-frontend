import type { User } from "$lib/models";
import { dashboard } from "$lib/navigation";
import { redirect } from "@sveltejs/kit";

export const onlyRole = (role: string, user?: User): User => {
  if (!user) {
    throw redirect(307, "/login");
  } else if (user.role !== role) {
    throw redirect(307, dashboard(user));
  }

  return user;
};
