<script context="module" lang="ts">
  export let openModal = () => {};
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let visible = false;

  // api
  openModal = () => {
    if (visible) {
      return;
    }
    window.addEventListener("keydown", closeOnEscape);

    //this prevents scrolling of the main window on larger screens
    document.body.style.overflow = "hidden";

    visible = true;
  };

  // events
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
    class="fixed z-10 inset-0 bg-gray-800 opacity-25 flex justify-center items-center"
    on:click={closeModal}
    on:keypress={closeOnEscape}
  >
    <div id="modal" on:click|stopPropagation={() => {}} on:keypress|stopPropagation={() => {}}>
      <div id="modal-content">
        <button on:click={closeModal}>close</button>
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  #modal {
    position: relative;
    border-radius: 6px;
    background: white;
    border: 2px solid #000;
    filter: drop-shadow(5px 5px 5px #555);
    padding: 1em;
  }

  #modal-content {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    overflow: auto;
  }
</style>
