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
  $: initialPermits = data.lists[openTab];
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

<Tab listName={openTab} {initialPermits} session={data.session} />

<style lang="postcss">
  .active {
    @apply border-b-2 border-green-400 text-green-400;
  }
</style>
