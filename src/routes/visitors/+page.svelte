<script lang="ts">
  import type { Visitor } from "$lib/models";
  import type { PageData } from "./$types";
  import { DEFAULT_AMT_PER_PAGE } from "$lib/constants";
  import { isOk } from "$lib/functional";
  import { afterNavigate } from "$app/navigation";
  import { searchVisitors } from "$lib/search";
  import VisitorList from "$lib/components/_VisitorList.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { page } from "$app/stores";

  // config
  const limit = DEFAULT_AMT_PER_PAGE;
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // props
  export let data: PageData;
  const visitorsResult = data.visitorsResult;
  const userRole = data.userRole;

  // model
  let initialVisitors: Array<Visitor>;
  let searchVal = "";
  let bannerError = "";

  // init
  afterNavigate(() => {
    initialVisitors = (visitorsResult.data && visitorsResult.data.records) || [];
  });

  // events
  const onSearch = async () => {
    const visitorRes = await searchVisitors(
      searchVal,
      initialVisitors,
      visitorsResult.data!.metadata.totalAmount
    );
    if (!isOk(visitorRes)) {
      visitorsResult.data!.records = initialVisitors;
      bannerError = visitorRes.message;
      return;
    }

    visitorsResult.data!.records = visitorRes.data;
    bannerError = "";
  };
</script>

<svelte:head>
  <title>All Visitors</title>
</svelte:head>

<h1>All Visitors</h1>

{#if !isOk(visitorsResult)}
  {visitorsResult.message}
{:else}
  <div class="stack-container">
    {#if bannerError != ""}
      <div>
        <p>Error searching: {bannerError}. Please try again later.</p>
      </div>
    {/if}
    <input type="text" bind:value={searchVal} on:input={onSearch} placeholder="Search Visitors" />
    <VisitorList
      {userRole}
      visitors={visitorsResult.data.records}
      totalAmount={visitorsResult.data.metadata.totalAmount}
    />
    <Pagination
      totalAmount={visitorsResult.data.metadata.totalAmount}
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
