import type { LayoutServerLoad } from "./$types";
import { parse } from "cookie";
import { isOk } from "$lib/functional";
import { sessionDecoder } from "$lib/auth";
import { post } from "$lib/api";

export const load: LayoutServerLoad = async (loadInput) => {
  // HACK: make this run for every single page-load
  // probably use invalidate once this https://github.com/sveltejs/kit/issues/6459 gets fixed
  loadInput.url.pathname;

  const cookies = parse(loadInput.request.headers.get("cookie") || "");
  if (!cookies.refresh) {
    return {};
  }

  // TODO: only call this if accessToken is about to expire
  const sessionRes = await post("api/refresh-tokens", {}, sessionDecoder, "", [
    ["cookie", `refresh=${cookies.refresh}`],
  ]);
  if (!isOk(sessionRes)) {
    return {};
  }

  return {
    session: {
      accessToken: sessionRes.data.accessToken,
      user: sessionRes.data.user,
    },
  };
};
