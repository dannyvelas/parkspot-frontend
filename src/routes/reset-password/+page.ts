import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  const accessToken = loadInput.url.searchParams.get("token");
  if (parentData.session) {
    redirect(307, "/dashboard");
  } else if (!accessToken) {
    redirect(307, "/login");
  }

  return {
    accessToken,
  };
};
