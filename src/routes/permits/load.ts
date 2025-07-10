import type { Result } from "$lib/functional";
import type { RouteParams, PageServerData, PageParentData } from './all/$types';
import type * as Kit from '@sveltejs/kit';
import type { ListWithMetadata, Permit } from "$lib/models";
import { MAX_AMT_PER_PAGE } from "$lib/constants";
import { browser } from "$app/environment";
import { getLatestToken } from "$lib/auth/jwt";
import { Request } from "$lib/api";
import { listWithMetadataDecoder, permitDecoder } from "$lib/models";

type OutputData = {
  permits: Result<ListWithMetadata<Permit>>;
  search: string;
  pageNum: number;
};

type PageLoad<E extends string> = Kit.Load<RouteParams, PageServerData, PageParentData, OutputData, E>;

export const loadPermits = <E extends string>(endpoint: string): PageLoad<E> => {
  const loadFn: PageLoad<typeof endpoint> = async (loadInput) => {
    const parentData = await loadInput.parent();
    const accessToken = !browser ? parentData.session.accessToken : await getLatestToken();
    const page = Number(loadInput.url.searchParams.get("page")) || 1;
    const search = loadInput.url.searchParams.get("search") || "";

    const permits = await new Request(listWithMetadataDecoder(permitDecoder))
      .addParams({ page: String(page), search, limit: String(MAX_AMT_PER_PAGE), reversed: "true" })
      .setAccessToken(accessToken)
      .setFetchFn(loadInput.fetch)
      .get(endpoint);

    return { permits, search, pageNum: page };
  };

  return loadFn;
};
