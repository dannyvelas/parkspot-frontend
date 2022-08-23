<script lang="ts">
  import type { Visitor } from "$lib/models";
  import type { PageData } from "./$types";
  import { isOk } from "$lib/functional";
  import { afterNavigate } from "$app/navigation";
  import { searchVisitors } from "$lib/search";
  import List from "./List.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { page } from "$app/stores";

  // config
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // props
  export let data: PageData;
  const { result, userRole, limit } = data;

  // model
  let initialVisitors: Array<Visitor>;
  let searchVal = "";
  let bannerError = "";

  // init
  afterNavigate(() => {
    initialVisitors = (result.data && result.data.records) || [];
  });

  // events
  const onSearch = async () => {
    const visitorRes = await searchVisitors(
      searchVal,
      initialVisitors,
      result.data!.metadata.totalAmount
    );
    if (!isOk(visitorRes)) {
      result.data!.records = initialVisitors;
      bannerError = visitorRes.message;
      return;
    }

    result.data!.records = visitorRes.data;
    bannerError = "";
  };
</script>

<svelte:head>
  <title>All Visitors</title>
</svelte:head>

<h1>All Visitors</h1>

{#if !isOk(result)}
  {result.message}
{:else}
  <div class="stack-container">
    {#if bannerError != ""}
      <div>
        <p>Error searching: {bannerError}. Please try again later.</p>
      </div>
    {/if}
    <input type="text" bind:value={searchVal} on:input={onSearch} placeholder="Search Visitors" />
    <List
      {userRole}
      visitors={result.data.records}
      totalAmount={result.data.metadata.totalAmount}
    />
    <Pagination
      totalAmount={result.data.metadata.totalAmount}
      pageToHref={(pageNum) => `visitors?page=${pageNum}`}
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
