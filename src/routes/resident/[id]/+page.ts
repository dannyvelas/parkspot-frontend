import type { PageLoad } from "./$types";
import { onlyRole } from "$lib/auth";
import { get } from "$lib/api";
import { residentDecoder } from "$lib/models";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  const session = onlyRole("admin", parentData.session);

  const result = await get(
    `api/resident/${loadInput.params.id}`,
    {},
    residentDecoder,
    session.accessToken
  );

  return {
    result,
    session,
  };
};
