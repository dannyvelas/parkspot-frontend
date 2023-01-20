import { writable } from "svelte/store";
import { Request } from "$lib/api";
import { sessionDecoder, expiringSoon } from "$lib/auth";
import { isOk } from "$lib/functional";
import { get } from "svelte/store";
import { invalidateAll } from "$app/navigation";

const createTokenStore = () => {
  const { subscribe, set } = writable("");

  return {
    subscribe,
    set,
    refresh: async () => {
      const sessionRes = await new Request(sessionDecoder).post("api/refresh-tokens");
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

  // if error when refreshing, invalidate session to sign user out
  if (get(tokenStore) === "") {
    await invalidateAll();
  }

  return get(tokenStore);
};
