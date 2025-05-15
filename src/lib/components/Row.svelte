<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script lang="ts">
  import { slide } from "svelte/transition";

  // model
  let isExpanded = false;
</script>

<div class="bg-white flex flex-col gap-2 rounded shadow-md px-2 lg:px-8 py-3">
  <div
    class="flex flex-row justify-between"
    on:click={() => (isExpanded = !isExpanded)}
    on:keypress={() => (isExpanded = !isExpanded)}
  >
    <div class="text-xs basis-3">
      {#if !isExpanded}
        <iconify-icon icon="material-symbols:keyboard-arrow-down-rounded" />
      {:else}
        <iconify-icon icon="material-symbols:keyboard-arrow-up-rounded" />
      {/if}
    </div>
    <slot name="cells" />
  </div>
  {#if isExpanded}
    <div transition:slide class="flex flex-col gap-y-5">
      <div>
        <slot name="header" />
        <hr class="my-3" />
        <slot name="top-content" />
      </div>
      <slot name="middle-content" />
      <slot name="bottom-content" />
    </div>
  {/if}
</div>
