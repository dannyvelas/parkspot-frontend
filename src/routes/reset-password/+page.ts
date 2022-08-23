import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { dashboard } from "$lib/navigation";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  const accessToken = loadInput.url.searchParams.get("token");
  if (parentData.user) {
    throw redirect(307, dashboard(parentData.user));
  } else if (accessToken == "" || accessToken == null) {
    throw redirect(307, "/login");
  }

  return {
    accessToken,
  };
};
