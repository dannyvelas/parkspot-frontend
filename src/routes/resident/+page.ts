import type { PageLoad } from "./$types";
import { onlyRole } from "$lib/auth";

export const load: PageLoad = async ({ parent }) => {
  const parentData = await parent();
  onlyRole("resident", parentData.session);
};
