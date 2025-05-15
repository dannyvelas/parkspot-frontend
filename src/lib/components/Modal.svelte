<script module lang="ts">
  type ModalCtrl = {
    open: () => void;
    close: () => void;
  };

  const modals: Map<String, ModalCtrl> = new Map();

  export function getModal(id = ""): ModalCtrl | undefined {
    return modals.get(id);
  }
</script>

<script lang="ts">
  import { stopPropagation } from 'svelte/legacy';

  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  
  interface Props {
    // props
    id?: string; // default id of Modal with no argument is ""
    children?: import('svelte').Snippet;
  }

  let { id = "", children }: Props = $props();

  // model
  let visible = $state(false);

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

  modals.set(id, { open: openModal, close: closeModal });

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
    onclick={closeModal}
    onkeypress={closeOnEscape}
  >
    <div
      class="bg-white rounded-md px-4 py-3 overflow-auto"
      id="modal-window"
      onclick={stopPropagation(() => {})}
      onkeypress={stopPropagation(() => {})}
    >
      <button onclick={closeModal}>
        <iconify-icon icon="mingcute:close-line" style="color:#6d6d6d" width="15" height="15"></iconify-icon>
      </button>
      {@render children?.()}
    </div>
  </div>
{/if}

<style>
  #modal-window {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
  }
</style>
