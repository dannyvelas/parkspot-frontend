import type { User } from "$lib/models";
import * as jose from "jose";

const REFRESH_SECRET: string = import.meta.env.VITE_TOKEN_REFRESHSECRET;

export const newRefresh = async (user: User) => {
  return await new jose.SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(Buffer.from(REFRESH_SECRET));
};

export const expiringSoon = (token: string) => {
  try {
    const payload = jose.decodeJwt(token);
    if (!payload.exp) {
      return true;
    }

    const epochTimeNow = (() => {
      var d = new Date();
      return Math.round(d.getTime() / 1000);
    })();

    const secsToExpiry = payload.exp - epochTimeNow;
    const minsToExpiry = Math.round(secsToExpiry / 60);
    return minsToExpiry <= 5;
  } catch (err) {
    return true; // JWT invalid
  }
};
