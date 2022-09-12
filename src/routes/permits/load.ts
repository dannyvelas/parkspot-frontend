import type { PageLoad } from "./all/$types";
import type { Result } from "$lib/functional";
import type { ListWithMetadata, Permit } from "$lib/models";
import type { Session } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import { permitDecoder } from "$lib/models";
import { loadList } from "$lib/load";

type OutputData = {
  result: Result<ListWithMetadata<Permit>>;
  session: Session;
};

export const loadPermits = (endpoint: string, reversed: boolean): PageLoad<OutputData> => {
  const loadFn: PageLoad<OutputData> = async (loadInput) => {
    const parentData = await loadInput.parent();
    if (!parentData.session) throw redirect(307, "/login");
    const page = Number(loadInput.url.searchParams.get("page")) || 1;

    const result = await loadList({
      endpoint,
      decoder: permitDecoder,
      reversed,
      page,
      accessToken: parentData.session.accessToken,
    });

    return {
      result,
      session: parentData.session,
    };
  };

  return loadFn;
};
