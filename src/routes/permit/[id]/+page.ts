import type { PageLoad } from "./$types";
import { get } from "$lib/api";
import { redirect } from "@sveltejs/kit";
import { permitDecoder } from "$lib/models";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  if (!parentData.session) {
    throw redirect(307, "/login");
  }

  const result = await get(
    `api/permit/${loadInput.params.id}`,
    {},
    permitDecoder,
    parentData.session.accessToken
  );

  return { result };
};
