import type { LayoutServerLoad } from "./$types";
import { parse } from "cookie";
import { userDecoder } from "$lib/models";
import { isOk } from "$lib/functional";
import { verifyRefresh } from "$lib/auth";

export const load: LayoutServerLoad = async ({ request }) => {
  const cookies = parse(request.headers.get("cookie") || "");
  if (!cookies.refresh) {
    return {};
  }

  const verifiedJWT = await verifyRefresh(cookies.refresh);
  if (!isOk(verifiedJWT)) {
    return {};
  }

  const decodedJWT = userDecoder.decode(verifiedJWT.data.payload.user);
  if (!decodedJWT.ok) {
    return {};
  }

  // TODO: return accessToken
  return {
    user: decodedJWT.value,
  };
};
