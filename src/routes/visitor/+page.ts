import type { PageLoad } from "./$types";
import { onlyRole } from "$lib/auth";

export const load: PageLoad = async ({ parent }) => {
  const parentData = await parent();
  const session = onlyRole("resident", parentData.session);

  return { session };
};
