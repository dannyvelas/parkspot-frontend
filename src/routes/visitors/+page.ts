import type { PageLoad } from "./$types";
import { DEFAULT_AMT_PER_PAGE } from "$lib/constants";
import { onlyRole } from "$lib/load";
import { visitorDecoder } from "$lib/models";
import { loadList } from "$lib/load";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  const user = onlyRole("admin", parentData.user);
  const page = Number(loadInput.url.searchParams.get("page")) || 1;
  const limit = DEFAULT_AMT_PER_PAGE;

  const result = await loadList({
    endpoint: "api/visitors",
    decoder: visitorDecoder,
    limit,
    reversed: false,
    page,
  });

  return {
    result,
    userRole: user.role,
    limit,
  };
};
