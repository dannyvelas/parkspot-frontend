import type { PageLoad } from "./$types";
import { MAX_AMT_PER_PAGE } from "$lib/constants";
import { Request } from "$lib/api";
import { listWithMetadataDecoder, residentDecoder } from "$lib/models";
import { onlyRole } from "$lib/auth";
import { getLatestToken } from "$lib/auth/jwt";
import { browser } from "$app/environment";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  const session = onlyRole("admin", parentData.session);
  const accessToken = !browser ? session.accessToken : await getLatestToken();
  const page = Number(loadInput.url.searchParams.get("page")) || 1;
  const search = loadInput.url.searchParams.get("search") || "";

  const residents = await new Request(listWithMetadataDecoder(residentDecoder))
    .addParams({ page: String(page), search, limit: String(MAX_AMT_PER_PAGE) })
    .setAccessToken(accessToken)
    .setFetchFn(loadInput.fetch)
    .get("api/residents");

  return { session, residents, search, pageNum: page };
};
