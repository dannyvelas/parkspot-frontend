import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ parent }) => {
  const parentData = await parent();
  if (!parentData.session) {
    throw redirect(307, "/login");
  }
  return { session: parentData.session };
};
