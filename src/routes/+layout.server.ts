import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { userDecoder } from "$lib/models";
import { isOk, newErr, newOk } from "$lib/functional";
import * as jsonwebtoken from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { Result } from "$lib/functional";
import type { LayoutServerLoad } from "./$types";

const TOKEN_SECRET = import.meta.env.VITE_TOKEN_SECRET;

const verifyJWT = (token: string): Result<{ user: string }> => {
  let verifiedJWT: string | JwtPayload;
  try {
    verifiedJWT = jwt.verify(token, TOKEN_SECRET);
  } catch (error) {
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      return newErr("JWT expired");
    } else {
      return newErr("Unhandled JWT verify error");
    }
  }

  if (typeof verifiedJWT === "string") {
    return newErr("JWT was string");
  } else if (!("user" in verifiedJWT)) {
    return newErr("JWT did not have 'user' field");
  }

  return newOk({ user: verifiedJWT.user });
};

export const load: LayoutServerLoad = async ({ request }) => {
  const cookies = parse(request.headers.get("cookie") || "");
  if (!cookies.refresh) {
    return {};
  }

  const verifiedJWT = verifyJWT(cookies.refresh);
  if (!isOk(verifiedJWT)) {
    return {};
  }

  const decodedJWT = userDecoder.decode(verifiedJWT.data.user);
  if (!decodedJWT.ok) {
    return {};
  }

  return {
    user: decodedJWT.value,
  };
};
