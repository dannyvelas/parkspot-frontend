<script lang="ts">
  import type { Visitor } from "$lib/models";
  import type { PageData } from "./$types";
  import type { Result } from "$lib/functional";
  import { visitorDecoder, previewVisitor } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { afterNavigate } from "$app/navigation";
  import List from "./List.svelte";
  import Search from "$lib/components/Search.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { page } from "$app/stores";

  // config
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // props
  export let data: PageData;
  const { result, userRole } = data;

  // model
  let initialVisitors: Array<Visitor>;
  let bannerError = "";

  // init
  afterNavigate(() => {
    initialVisitors = (result.data && result.data.records) || [];
  });

  // events
  const updateRecords = async (event: CustomEvent<Result<Visitor[]>>) => {
    if (!isOk(event.detail)) {
      result.data!.records = initialVisitors;
      bannerError = `Error searching: ${event.detail.message}`;
      return;
    }

    result.data!.records = event.detail.data;
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
    <Search
      initialList={initialVisitors}
      decoder={visitorDecoder}
      preview={previewVisitor}
      totalAmount={result.data.metadata.totalAmount}
      endpoint={`api/visitors`}
      on:result={updateRecords}
    />
    <List
      {userRole}
      visitors={result.data.records}
      totalAmount={result.data.metadata.totalAmount}
    />
    <Pagination
      totalAmount={result.data.metadata.totalAmount}
      pageToHref={(pageNum) => `visitors?page=${pageNum}`}
      {currPageNum}
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
