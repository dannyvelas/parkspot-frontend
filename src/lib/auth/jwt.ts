import * as jose from "jose";
import { Request } from "$lib/api";
import { sessionDecoder } from "$lib/auth/session";
import { getToken, setToken } from '$lib/auth/token.svelte';
import { isOk } from "$lib/functional";
import { invalidateAll } from "$app/navigation";

export const getLatestToken = async () => {
  if (expiringSoon(getToken())) {
    const sessionRes = await new Request(sessionDecoder).post("api/refresh-tokens");
    if (!isOk(sessionRes)) {
      // logout user if refresh request failed
      const postRes = await fetch("/logout", { method: "POST" });
      if (!postRes.ok) {
        console.error("Error logging out after fetching latest token");
      }
      invalidateAll();

      return "";
    }
    setToken(sessionRes.data.accessToken);
  }

  return getToken();
};

const expiringSoon = (token: string) => {
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
