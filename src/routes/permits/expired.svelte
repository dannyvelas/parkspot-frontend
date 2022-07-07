<script context="module" lang="ts">
  import { DEFAULT_AMT_PER_PAGE } from "$lib/constants";
  import { permitDecoder } from "$lib/models";
  import loadList from "$lib/loadList";

  const limit = DEFAULT_AMT_PER_PAGE;

  export const load = loadList("api/permits/expired", permitDecoder, limit, false, "admin");
</script>

<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { afterNavigate } from "$app/navigation";
  import { searchPermits } from "$lib/search";
  import PermitsList from "$lib/_PermitsList.svelte";

  // props
  export let result: Result<ListWithMetadata<Permit>>;
  export let currPageNum: number;

  // model
  let initialPermits: Array<Permit>;
  let searchVal = "";
  let bannerError = "";

  // init
  afterNavigate(() => {
    initialPermits = (result.data && result.data.records) || [];
  });

  // events
  const onSearch = async () => {
    const permitRes = await searchPermits(
      searchVal,
      initialPermits,
      result.data!.metadata.totalAmount,
      "expired"
    );
    if (!isOk(permitRes)) {
      result.data!.records = initialPermits;
      bannerError = permitRes.message;
      return;
    }

    result.data!.records = permitRes.data;
    bannerError = "";
  };
</script>

<svelte:head>
  <title>Expired Permits</title>
</svelte:head>

<h1>Expired Permits</h1>

{#if !isOk(result)}
  {result.message}
{:else}
  <div class="stack-container">
    {#if bannerError != ""}
      <div>
        <p>Error searching: {bannerError}. Please try again later.</p>
      </div>
    {/if}
    <input type="text" bind:value={searchVal} on:input={onSearch} placeholder="Search Permits" />
    <PermitsList
      listType="active"
      permits={result.data.records}
      totalAmount={result.data.metadata.totalAmount}
      pageToHref={(pageNum) => `/permits/active?page=${pageNum}`}
      {currPageNum}
      {limit}
    />
  </div>
{/if}

<style>
  .stack-container {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    text-align: center;
  }
</style>
