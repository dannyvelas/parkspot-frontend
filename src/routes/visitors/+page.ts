import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { visitorDecoder } from "$lib/models";
import { loadList } from "$lib/load";

export const load: PageLoad = async (loadInput) => {
  const parentData = await loadInput.parent();
  if (!parentData.session) throw redirect(307, "/login");
  const page = Number(loadInput.url.searchParams.get("page")) || 1;

  const result = await loadList({
    endpoint: "api/visitors",
    decoder: visitorDecoder,
    reversed: false,
    page,
    accessToken: parentData.session.accessToken,
  });

  return {
    result,
    session: parentData.session,
  };
};
