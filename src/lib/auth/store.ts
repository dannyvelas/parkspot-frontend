import { writable } from "svelte/store";
import { post } from "$lib/api";
import { sessionDecoder, expiringSoon } from "$lib/auth";
import { isOk } from "$lib/functional";
import { get } from "svelte/store";

export const createTokenStore = () => {
  const { subscribe, set } = writable("");

  return {
    subscribe,
    set,
    refresh: async () => {
      const sessionRes = await post("api/refresh-tokens", {}, sessionDecoder, "");
      if (!isOk(sessionRes)) {
        return set("");
      }
      return set(sessionRes.data.accessToken);
    },
  };
};

export const tokenStore = createTokenStore();

export const getLatestToken = async () => {
  if (expiringSoon(get(tokenStore))) {
    await tokenStore.refresh();
  }
  return get(tokenStore);
};
