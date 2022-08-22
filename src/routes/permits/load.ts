import type { Load } from "@sveltejs/kit";
import { onlyRole } from "$lib/load";
import { permitDecoder } from "$lib/models";
import { loadList } from "$lib/load";

export const loadPermits = (endpoint: string, limit: number): Load => {
  const loadFn: Load = async (loadInput) => {
    const parentData = await loadInput.parent();
    const user = onlyRole("admin", parentData.user);
    const page = Number(loadInput.url.searchParams.get("page")) || 1;

    const permitsResult = await loadList({
      endpoint,
      decoder: permitDecoder,
      limit,
      reversed: false,
      page,
    });

    return {
      permitsResult,
      userRole: user.role,
      limit,
    };
  };

  return loadFn;
};
