import type { LayoutLoad } from "./$types";
import { browser } from "$app/environment";
import { tokenStore } from "$lib/auth";

export const load: LayoutLoad = async (loadInput) => {
  if (browser && loadInput.data.session) {
    tokenStore.set(loadInput.data.session.accessToken);
  }

  return loadInput.data;
};
