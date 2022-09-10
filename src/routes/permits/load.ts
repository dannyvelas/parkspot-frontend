import type { PageLoad } from "./all/$types";
import type { Result } from "$lib/functional";
import type { ListWithMetadata, Permit } from "$lib/models";
import type { Session } from "$lib/auth";
import { onlyRole } from "$lib/auth";
import { permitDecoder } from "$lib/models";
import { loadList } from "$lib/load";

type OutputData = {
  result: Result<ListWithMetadata<Permit>>;
  session: Session;
};

export const loadPermits = (endpoint: string, reversed: boolean): PageLoad<OutputData> => {
  const loadFn: PageLoad<OutputData> = async (loadInput) => {
    const parentData = await loadInput.parent();
    const session = onlyRole("admin", parentData.session);
    const page = Number(loadInput.url.searchParams.get("page")) || 1;

    const result = await loadList({
      endpoint,
      decoder: permitDecoder,
      reversed,
      page,
      accessToken: session.accessToken,
    });

    return {
      result,
      session,
    };
  };

  return loadFn;
};
