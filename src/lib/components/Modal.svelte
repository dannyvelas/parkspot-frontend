<script context="module" lang="ts">
  type ModalCtrl = {
    open: () => void;
  };

  const modals: Map<String, ModalCtrl> = new Map();

  export function getModal(id = ""): ModalCtrl | undefined {
    return modals.get(id);
  }
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  // props
  export let id = ""; // default id of Modal with no argument is ""

  // model
  let visible = false;

  // events
  function openModal() {
    if (visible) {
      return;
    }
    window.addEventListener("keydown", closeOnEscape);

    //this prevents scrolling of the main window on larger screens
    document.body.style.overflow = "hidden";

    visible = true;
  }

  function closeModal() {
    if (!visible) {
      return;
    }

    window.removeEventListener("keydown", closeOnEscape);

    document.body.style.overflow = "";

    visible = false;
  }

  modals.set(id, { open: openModal });

  function closeOnEscape(ev: KeyboardEvent) {
    if (ev.key == "Escape") closeModal();
  }

  // lifecycle
  onDestroy(() => {
    modals.delete(id);
    if (browser) {
      window.removeEventListener("keydown", closeOnEscape);
    }
  });
</script>

{#if visible}
  <div
    class="fixed z-10 inset-0 bg-gray-800 bg-opacity-25 flex justify-center items-center"
    on:click={closeModal}
    on:keypress={closeOnEscape}
  >
    <div
      class="bg-white rounded-md px-4 py-3 overflow-auto"
      id="modal-window"
      on:click|stopPropagation={() => {}}
      on:keypress|stopPropagation={() => {}}
    >
      <button on:click={closeModal}>
        <iconify-icon icon="mingcute:close-line" style="color:#6d6d6d" width="15" height="15" />
      </button>
      <slot />
    </div>
  </div>
{/if}

<style>
  #modal-window {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
  }
</style>
