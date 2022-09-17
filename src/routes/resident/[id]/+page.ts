import type { PageLoad } from "./$types";
import { onlyRole } from "$lib/auth";
import { get } from "$lib/api";
import { residentDecoder } from "$lib/models";
import { getLatestToken } from "$lib/auth";
import { browser } from "$app/environment";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  const session = onlyRole("admin", parentData.session);

  const accessToken = !browser ? session.accessToken : await getLatestToken();
  const result = await get(`api/resident/${loadInput.params.id}`, {}, residentDecoder, accessToken);

  return { result };
};
