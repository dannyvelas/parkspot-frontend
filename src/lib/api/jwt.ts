import * as jose from "jose";
import { newErr, newOk } from "$lib/functional";

const TOKEN_SECRET: string = import.meta.env.VITE_TOKEN_REFRESHSECRET;

export const verifyJWT = async (token: string) => {
  let verifiedJWT: jose.JWTVerifyResult;
  try {
    verifiedJWT = await jose.jwtVerify(token, Buffer.from(TOKEN_SECRET));
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
