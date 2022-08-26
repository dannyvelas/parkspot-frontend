import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ parent }) => {
  const parentData = await parent();
  if (!parentData.user) {
    throw redirect(307, "/login");
  }

  const residentId = parentData.user.role === "resident" ? parentData.user.id : "";

  return {
    residentId,
    user: parentData.user,
  };
};
