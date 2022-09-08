import type { LayoutServerLoad } from "./$types";
import { parse } from "cookie";
import { userDecoder } from "$lib/models";
import { isOk } from "$lib/functional";
import { verifyRefresh, newAccess } from "$lib/auth";

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

  const user = decodedJWT.value;
  const accessToken = await newAccess(user.id, user.role);

  return {
    session: {
      accessToken,
      user,
    },
  };
};
