import type { LayoutLoad } from "./$types";
import { isOk } from "$lib/functional";
import { sessionDecoder } from "$lib/api/session";
import { browser } from "$app/env";
import { post } from "$lib/api/send";
import { get, writable } from "svelte/store";
import { tokenStore } from "$lib/api/store";

const attemptRefresh = async () => {
  const session = await post("api/refresh_tokens", {}, sessionDecoder);
  if (!isOk(session)) {
    console.log("FAILURE");
    return "";
  }

  return session.data.accessToken;
};

export const load: LayoutLoad = async (loadInput) => {
  // in server
  if (!browser) {
    return { user: loadInput.data.user, tokenStore: writable("") };
  }

  console.log("IN BROWSER");

  // not supposed to be signed in
  if (!loadInput.data.user) {
    console.log("NOT SUPPOSED TO BE SIGNED IN");
    return { user: loadInput.data.user, tokenStore: writable("") };
  }

  // in client, supposed to be signed in but access token store doesn't exist
  const accessToken = get(tokenStore);
  if (accessToken === "") {
    console.log("IN CLIENT NO ACCESS TOKEN");
    const maybeAccessToken = await attemptRefresh();
    tokenStore.set(maybeAccessToken);
    console.log("END IN CLIENT NO ACCESS TOKEN");
    return { user: loadInput.data.user, tokenStore: writable(maybeAccessToken) };
  }

  // access token exists
  return {
    user: loadInput.data.user,
    tokenStore,
  };
};
