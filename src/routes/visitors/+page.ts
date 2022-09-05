import type { PageLoad } from "./$types";
import { onlyRole } from "$lib/load";
import { get } from 'svelte/store';
import { visitorDecoder } from "$lib/models";
import { loadList } from "$lib/load";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  const user = onlyRole("admin", parentData.user);
  const page = Number(loadInput.url.searchParams.get("page")) || 1;

  const result = await loadList({
    endpoint: "api/visitors",
    decoder: visitorDecoder,
    reversed: false,
    page,
    accessToken: get(parentData.tokenStore)
  });

  return {
    result,
    userRole: user.role,
  };
};
