import * as jose from "jose";
import { Request } from "$lib/api";
import { sessionDecoder, tokenStore } from "$lib/auth";
import { isOk } from "$lib/functional";
import { get } from "svelte/store";
import { invalidateAll } from "$app/navigation";

export const getLatestToken = async () => {
  if (expiringSoon(get(tokenStore))) {
    const sessionRes = await new Request(sessionDecoder).post("api/refresh-tokens");
    if (!isOk(sessionRes)) {
      // logout user if referesh request failed
      const postRes = await fetch("/logout", { method: "POST" });
      if (!postRes.ok) {
        console.error("Error logging out after fetching latest token");
      }
      invalidateAll();

      return "";
    }
    tokenStore.set(sessionRes.data.accessToken);
  }

  return get(tokenStore);
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
