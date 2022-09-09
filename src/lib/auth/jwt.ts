import type { User } from "$lib/models";
import * as jose from "jose";
import { newErr, newOk } from "$lib/functional";

const REFRESH_SECRET: string = import.meta.env.VITE_TOKEN_REFRESHSECRET;
const ACCESS_SECRET: string = import.meta.env.VITE_TOKEN_ACCESSSECRET;

export const verifyRefresh = async (token: string) => {
  let verifiedJWT: jose.JWTVerifyResult;
  try {
    verifiedJWT = await jose.jwtVerify(token, Buffer.from(REFRESH_SECRET));
  } catch (err) {
    if (err instanceof jose.errors.JWTExpired) {
      return newErr("jwt expired");
    } else if (err instanceof jose.errors.JWSSignatureVerificationFailed) {
      return newErr("jwt verification failed");
    } else {
      return newErr("unhandled error verifying jwt");
    }
  }

  return newOk(verifiedJWT);
};

export const newRefresh = async (user: User) => {
  return await new jose.SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(Buffer.from(REFRESH_SECRET));
};

export const newAccess = async (id: string, role: string) => {
  return await new jose.SignJWT({ payload: { id, role } })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("7d")
    .sign(Buffer.from(ACCESS_SECRET));
};
