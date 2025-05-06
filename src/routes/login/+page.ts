import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ parent }) => {
  const parentData = await parent();
  if (parentData.session) {
    redirect(307, "/dashboard");
  }

  return {};
};
