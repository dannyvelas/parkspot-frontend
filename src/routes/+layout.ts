import type { LayoutLoad } from "./$types";
import { browser } from "$app/environment";
import { setToken } from "$lib/auth";

export const load: LayoutLoad = async (loadInput) => {
  if (browser) {
    if (loadInput.data.session) {
      setToken(loadInput.data.session.accessToken);
    } else {
      setToken("");
    }
  }

  return loadInput.data;
};
