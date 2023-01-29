import type { PageLoad } from "./$types";
import type { PermitLists } from "./types";
import type { Session } from "$lib/auth";
import { listWithMetadataDecoder } from "$lib/models";
import { browser } from "$app/environment";
import { getLatestToken } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import { permitDecoder } from "$lib/models";
import { Request } from "$lib/api";

type OutputData = {
  lists: PermitLists;
  session: Session;
};

export const load: PageLoad<OutputData> = async (loadInput) => {
  const parentData = await loadInput.parent();
  if (!parentData.session) throw redirect(307, "/login");

  const accessToken = !browser ? parentData.session.accessToken : await getLatestToken();
  const page = loadInput.url.searchParams.get("page") || "1";

  const req = new Request(listWithMetadataDecoder(permitDecoder))
    .addParams({ page })
    .setAccessToken(accessToken);

  const [all, active, expired, exceptions] = await Promise.all([
    req.addParams({ reversed: "true" }).get("api/permits/all"),
    req.get("api/permits/active"),
    req.get("api/permits/expired"),
    req.get("api/permits/exceptions"),
  ]);

  return {
    lists: {
      all,
      active,
      expired,
      exceptions,
    },
    session: parentData.session,
  };
};
