import type { LayoutServerLoad } from "./$types";
import { parse } from "cookie";
import { isOk } from "$lib/functional";
import { sessionDecoder } from "$lib/auth";
import { post } from "$lib/api";

export const load: LayoutServerLoad = async (loadInput) => {
  const cookies = parse(loadInput.request.headers.get("cookie") || "");
  if (!cookies.refresh) {
    return {};
  }

  const sessionRes = await post("api/refresh-tokens", {}, sessionDecoder, "", [
    ["cookie", `refresh=${cookies.refresh}`],
  ]);
  if (!isOk(sessionRes)) {
    return {};
  }

  // TODO: send to fronted a new cookie via header
  return {
    session: {
      accessToken: sessionRes.data.accessToken,
      user: sessionRes.data.user,
    },
  };
};
