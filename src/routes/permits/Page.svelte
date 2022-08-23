<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata, permitList } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { afterNavigate } from "$app/navigation";
  import { searchPermits } from "$lib/search";
  import List from "./List.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { page } from "$app/stores";

  // props
  export let listName: permitList;
  export let result: Result<ListWithMetadata<Permit>>;
  export let userRole: string;
  export let limit: number;
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

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
      listName
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
  <title>{listName} Permits</title>
</svelte:head>

<h1>{listName} Permits</h1>

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
    <List
      {listName}
      permits={result.data.records}
      totalAmount={result.data.metadata.totalAmount}
      {userRole}
    />
    <Pagination
      totalAmount={result.data.metadata.totalAmount}
      pageToHref={(pageNum) => `/permits/${listName}?page=${pageNum}`}
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
