import type { PageLoad } from "./$types";
import type { Result } from "$lib/functional";
import type { ListWithMetadata, Resident } from "$lib/models";
import { onlyRole } from "$lib/auth";
import { residentDecoder } from "$lib/models";
import { loadList } from "$lib/load";

type OutputData = {
  result: Result<ListWithMetadata<Resident>>;
};

export const loadResidents = (endpoint: string, reversed: boolean): PageLoad<OutputData> => {
  const loadFn: PageLoad<OutputData> = async (loadInput) => {
    const parentData = await loadInput.parent();
    const session = onlyRole("admin", parentData.session);
    const page = Number(loadInput.url.searchParams.get("page")) || 1;

    const result = await loadList({
      endpoint,
      decoder: residentDecoder,
      reversed,
      page,
      accessToken: session.accessToken,
    });

    return { result };
  };

  return loadFn;
};
