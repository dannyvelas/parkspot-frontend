import type { PageLoad } from "./$types";
import { onlyRole } from "$lib/auth";
import { visitorDecoder } from "$lib/models";
import { loadList } from "$lib/load";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  const session = onlyRole("admin", parentData.session);
  const page = Number(loadInput.url.searchParams.get("page")) || 1;

  const result = await loadList({
    endpoint: "api/visitors",
    decoder: visitorDecoder,
    reversed: false,
    page,
    accessToken: session.accessToken,
  });

  return {
    result,
    session,
  };
};
