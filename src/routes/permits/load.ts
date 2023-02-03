import type { PageLoad } from "./all/$types";
import type { Result } from "$lib/functional";
import type { ListWithMetadata, Permit } from "$lib/models";
import { MAX_AMT_PER_PAGE } from "$lib/constants";
import { browser } from "$app/environment";
import { getLatestToken } from "$lib/auth";
import { Request } from "$lib/api";
import { listWithMetadataDecoder, permitDecoder } from "$lib/models";

type OutputData = {
  initialPermits: Result<ListWithMetadata<Permit>>;
};

export const loadPermits = (endpoint: string): PageLoad<OutputData> => {
  const loadFn: PageLoad<OutputData> = async (loadInput) => {
    const parentData = await loadInput.parent();
    const accessToken = !browser ? parentData.session.accessToken : await getLatestToken();
    const page = loadInput.url.searchParams.get("page") || "1";

    const initialPermits = await new Request(listWithMetadataDecoder(permitDecoder))
      .addParams({ page, limit: String(MAX_AMT_PER_PAGE), reversed: "true" })
      .setAccessToken(accessToken)
      .get(endpoint);

    return { initialPermits };
  };

  return loadFn;
};
