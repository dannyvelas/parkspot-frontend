import type { LayoutLoad } from "./$types";
import { isOk } from "$lib/functional";
import { sessionDecoder } from "$lib/auth";
import { browser } from "$app/env";
import { post } from "$lib/api";

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
    return { user: loadInput.data.user, accessToken: "" };
  }

  // set `refresh-tokens` as this load functions unique identifier
  loadInput.depends("refresh-tokens");

  console.log("IN BROWSER");

  // not supposed to be signed in
  if (!loadInput.data.user) {
    console.log("NOT SUPPOSED TO BE SIGNED IN");
    return { user: loadInput.data.user, accessToken: "" };
  }

  // in client, supposed to be signed in, so refresh token
  console.log("REFRESHING");
  const maybeAccessToken = await attemptRefresh();
  console.log("END REFRESHING");
  return { user: loadInput.data.user, accessToken: maybeAccessToken };
};
