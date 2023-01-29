<script lang="ts">
  import type { PageData } from "./$types";
  import type { permitList } from "$lib/models";
  import { capitalize } from "$lib/convert";
  import Tab from "./Tab.svelte";

  // props
  export let data: PageData;

  // model
  let permitTabs: permitList[] = ["all", "active", "expired", "exceptions"];
  let openTab: permitList = "all";
</script>

<svelte:head>
  <title>Permits</title>
</svelte:head>

<nav>
  <ul class="flex flex-row gap-12 border-b mb-4">
    {#each permitTabs as permitTab}
      <li>
        <button
          class="text-sm text-gray-400"
          class:active={openTab === permitTab}
          on:click={() => (openTab = permitTab)}>{capitalize(permitTab)}</button
        >
      </li>
    {/each}
  </ul>
</nav>

{#each permitTabs as permitTab}
  {#if openTab === permitTab}
    <Tab listName={permitTab} initialPermits={data.lists[permitTab]} session={data.session} />
  {/if}
{/each}

<style lang="postcss">
  .active {
    @apply border-b-2 border-green-400 text-green-400;
  }
</style>
