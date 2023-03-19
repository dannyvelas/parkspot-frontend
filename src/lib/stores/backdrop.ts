import { writable } from "svelte/store";

const createBackdropStore = () => {
  const { subscribe, set } = writable({
    isOpen: false,
  });

  return {
    subscribe,
    set,
  };
};

export const backdropStore = createBackdropStore();
