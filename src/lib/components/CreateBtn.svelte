<script lang="ts">
  import { createEventDispatcher } from "svelte";

  // config
  const dispatch = createEventDispatcher();
</script>

<div
  class="flex flex-row items-center gap-x-2 cursor-default"
  on:click={() => dispatch("click")}
  on:keydown={() => dispatch("click")}
>
  <span class="text-xs text-green-400">Create</span>
  <iconify-icon icon="ph:plus-circle-bold" class="text-green-400" />
</div>
