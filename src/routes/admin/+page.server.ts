import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();
  if (!parentData.user) {
    throw redirect(307, "/login");
  }

  return {};
};
