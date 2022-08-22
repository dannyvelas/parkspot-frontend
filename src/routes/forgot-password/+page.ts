import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { dashboard } from "$lib/navigation";

export const load: PageLoad = async ({ parent }) => {
  const parentData = await parent();
  if (parentData.user) {
    throw redirect(307, dashboard(parentData.user));
  }

  return {};
};
