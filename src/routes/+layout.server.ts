import { parse } from "cookie";
import { userDecoder } from "$lib/models";
import { isOk } from "$lib/functional";
import { verifyJWT } from "$lib/api/jwt";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ request }) => {
  const cookies = parse(request.headers.get("cookie") || "");
  if (!cookies.refresh) {
    return {};
  }

  const verifiedJWT = await verifyJWT(cookies.refresh);
  if (!isOk(verifiedJWT)) {
    return {};
  }

  const decodedJWT = userDecoder.decode(verifiedJWT.data.payload.user);
  if (!decodedJWT.ok) {
    return {};
  }

  return {
    user: decodedJWT.value,
  };
};
