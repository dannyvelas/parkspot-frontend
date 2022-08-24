import type { PageLoad } from "./all/$types";
import type { Result } from "$lib/functional";
import type { ListWithMetadata, Permit } from "$lib/models";
import { onlyRole } from "$lib/load";
import { permitDecoder } from "$lib/models";
import { loadList } from "$lib/load";

type OutputData = {
  result: Result<ListWithMetadata<Permit>>;
  userRole: string;
};

export const loadPermits = (endpoint: string, reversed: boolean): PageLoad<OutputData> => {
  const loadFn: PageLoad<OutputData> = async (loadInput) => {
    const parentData = await loadInput.parent();
    const user = onlyRole("admin", parentData.user);
    const page = Number(loadInput.url.searchParams.get("page")) || 1;

    const result = await loadList({
      endpoint,
      decoder: permitDecoder,
      reversed,
      page,
    });

    return {
      result,
      userRole: user.role,
    };
  };

  return loadFn;
};
