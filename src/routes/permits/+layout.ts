import type { LayoutLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  if (!parentData.session) redirect(307, "/login");

  return { session: parentData.session };
};
