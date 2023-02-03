import { writable } from "svelte/store";

const createTokenStore = () => {
  const { subscribe, set } = writable("");

  return {
    subscribe,
    set,
  };
};

export const tokenStore = createTokenStore();
