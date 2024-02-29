import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { Request } from "$lib/api";
import { getLatestToken } from "$lib/auth/jwt";
import { permitDecoder } from "$lib/models";
import { browser } from "$app/environment";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  if (!parentData.session) {
    throw redirect(307, "/login");
  }
  const accessToken = !browser ? parentData.session.accessToken : await getLatestToken();
  const result = await new Request(permitDecoder)
    .setAccessToken(accessToken)
    .setFetchFn(loadInput.fetch)
    .get(`api/permit/${loadInput.params.id}`);

  return { result };
};
