<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata, permitList } from "$lib/models";
  import { permitDecoder, previewPermit } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/convert";
  import { afterNavigate } from "$app/navigation";
  import List from "./List.svelte";
  import Search from "$lib/components/Search.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { page } from "$app/stores";

  // props
  export let listName: permitList;
  export let result: Result<ListWithMetadata<Permit>>;
  export let userRole: string;
  export let limit: number;
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // model
  let initialPermits: Array<Permit>; // holds permits before any searching happened
  let bannerError = "";
  let listTitle = (() => {
    if (listName === "exceptions") {
      return "Exception";
    }
    return capitalize(listName);
  })();

  // init
  afterNavigate(() => {
    initialPermits = (result.data && result.data.records) || [];
  });

  // events
  const updateRecords = async (event: CustomEvent<Result<Permit[]>>) => {
    if (!isOk(event.detail)) {
      result.data!.records = initialPermits;
      bannerError = `Error searching: ${event.detail.message}`;
      return;
    }

    result.data!.records = event.detail.data;
    bannerError = "";
  };
</script>

<svelte:head>
  <title>{listTitle} Permits</title>
</svelte:head>

<h1>{listTitle} Permits</h1>

{#if !isOk(result)}
  {result.message}
{:else}
  <div class="stack-container">
    {#if bannerError != ""}
      <div>
        <p>{bannerError}. Please try again later.</p>
      </div>
    {/if}
    <Search
      initialList={initialPermits}
      decoder={permitDecoder}
      preview={previewPermit}
      totalAmount={result.data.metadata.totalAmount}
      endpoint={`api/permits/${listName}`}
      on:result={updateRecords}
    />
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
