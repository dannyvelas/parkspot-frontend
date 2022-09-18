import type { LayoutLoad } from "./$types";
import { browser } from "$app/environment";
import { tokenStore } from "$lib/auth";

export const load: LayoutLoad = async (loadInput) => {
  if (browser) {
    if (loadInput.data.session) {
      tokenStore.set(loadInput.data.session.accessToken);
    } else {
      tokenStore.set("");
    }
  }

  return loadInput.data;
};
