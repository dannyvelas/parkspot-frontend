import type { PageLoad } from "./$types";
import { DEFAULT_AMT_PER_PAGE } from "$lib/constants";
import { redirect } from "@sveltejs/kit";
import { dashboard } from "$lib/navigation";
import { visitorDecoder } from "$lib/models";
import { loadList } from "$lib/load";

const limit = DEFAULT_AMT_PER_PAGE;

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  if (!parentData.user) {
    throw redirect(307, "/login");
  } else if (parentData.user.role !== "admin") {
    throw redirect(307, dashboard(parentData.user));
  }

  const page = Number(loadInput.url.searchParams.get("page")) || 1;

  const visitorsResult = await loadList({
    endpoint: "api/visitors",
    decoder: visitorDecoder,
    limit,
    reversed: false,
    page,
  });

  return {
    visitorsResult,
    userRole: parentData.user.role,
  };
};
