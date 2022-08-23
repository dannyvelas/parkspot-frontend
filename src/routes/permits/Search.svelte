<script lang="ts">
  import type { Permit, permitList } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import { searchPermits } from "$lib/search";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let onInput: boolean;
  export let initialPermits: Array<Permit>;
  export let totalAmount: number;
  export let listName: permitList;

  // model
  let searchVal = "";

  // events
  const onSearch = async () => {
    console.log(searchVal);
    const permitRes = await searchPermits(searchVal, initialPermits, totalAmount, listName);
    dispatch("result", permitRes);
  };
</script>

{#if onInput}
  <input type="text" bind:value={searchVal} on:input={onSearch} placeholder="Search Permits" />
{:else}
  <input type="text" bind:value={searchVal} placeholder="Search Permits" />
  <button on:click={onSearch}>Search</button>
{/if}
