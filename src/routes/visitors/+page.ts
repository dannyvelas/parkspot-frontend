import type { PageLoad } from "./$types";
import { MAX_AMT_PER_PAGE } from "$lib/constants";
import { Request } from "$lib/api";
import { listWithMetadataDecoder, visitorDecoder } from "$lib/models";
import { onlyRole, getLatestToken } from "$lib/auth";
import { browser } from "$app/environment";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  const session = onlyRole("admin", parentData.session);
  const accessToken = !browser ? session.accessToken : await getLatestToken();
  const page = Number(loadInput.url.searchParams.get("page")) || 1;
  const search = loadInput.url.searchParams.get("search") || "";

  const visitors = await new Request(listWithMetadataDecoder(visitorDecoder))
    .addParams({ page: String(page), search, limit: String(MAX_AMT_PER_PAGE) })
    .setAccessToken(accessToken)
    .setFetchFn(loadInput.fetch)
    .get("api/visitors");

  return { session, visitors, search, pageNum: page };
};
