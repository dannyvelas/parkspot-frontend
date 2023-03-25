<script context="module" lang="ts">
  export let openModal = () => {};
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let visible = false;

  // events
  openModal = () => {
    if (visible) {
      return;
    }
    window.addEventListener("keydown", closeOnEscape);

    //this prevents scrolling of the main window on larger screens
    document.body.style.overflow = "hidden";

    visible = true;
  };

  function closeModal() {
    if (!visible) {
      return;
    }

    window.removeEventListener("keydown", closeOnEscape);

    document.body.style.overflow = "";

    visible = false;
  }

  function closeOnEscape(ev: KeyboardEvent) {
    if (ev.key == "Escape") closeModal();
  }

  // lifecycle
  onDestroy(() => {
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
      class="bg-white rounded-md p-2"
      on:click|stopPropagation={() => {}}
      on:keypress|stopPropagation={() => {}}
    >
      <button on:click={closeModal}>
        <iconify-icon icon="mingcute:close-line" style="color:#6d6d6d" width="15" height="15" />
      </button>
      <div id="modal-content" class="overflow-auto">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  #modal-content {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
  }
</style>
