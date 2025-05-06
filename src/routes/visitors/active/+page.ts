import type { PageLoad } from "./$types";
import { MAX_AMT_PER_PAGE } from "$lib/constants";
import { Request } from "$lib/api";
import { listWithMetadataDecoder, visitorDecoder } from "$lib/models";
import { getLatestToken } from "$lib/auth/jwt";
import { browser } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  if (!parentData.session) redirect(307, "/login");
  const accessToken = !browser ? parentData.session.accessToken : await getLatestToken();
  const page = Number(loadInput.url.searchParams.get("page")) || 1;
  const search = loadInput.url.searchParams.get("search") || "";

  const visitors = await new Request(listWithMetadataDecoder(visitorDecoder))
    .addParams({ page: String(page), search, limit: String(MAX_AMT_PER_PAGE) })
    .setAccessToken(accessToken)
    .setFetchFn(loadInput.fetch)
    .get("api/visitors/active");

  return { session: parentData.session, visitors, search, pageNum: page };
};
