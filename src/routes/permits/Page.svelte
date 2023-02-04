<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata, permitList } from "$lib/models";
  import type { Session } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/convert";
  import List from "./List.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  // props
  export let listName: permitList;
  export let permits: Result<ListWithMetadata<Permit>>;
  export let session: Session;
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // model
  let searchVal = $page.url.searchParams.get("search") || "";
  let bannerError = "";

  // events
  const handleSearch = async () => {
    if (searchVal === "" && $page.url.searchParams.get("search") === "") {
      return;
    }

    if (searchVal === "") {
      goto("?");
      return;
    }

    let query = new URLSearchParams($page.url.searchParams);
    query.set("search", searchVal);
    query.delete("page"); // searches will purposely erase the state of the current page number
    goto(`?${query.toString()}`);
  };
  const pageToHref = (pageNum: number) => {
    const searchParam = searchVal === "" ? "" : `search=${searchVal}&`;
    return `/permits/${listName}?${searchParam}page=${pageNum}`;
  };
</script>

<h1>{capitalize(listName)}</h1>

{#if !isOk(permits)}
  {permits.message}
{:else if isOk(permits)}
  <div>
    {#if bannerError != ""}
      <div>
        <p>{bannerError}. Please try again later.</p>
      </div>
    {/if}
    <input type="text" bind:value={searchVal} placeholder="Search" />
    <button on:click={handleSearch}>Search</button>
    <List
      {listName}
      permits={permits.data.records}
      totalAmount={permits.data.metadata.totalAmount}
      user={session.user}
    />
    <Pagination totalAmount={permits.data.metadata.totalAmount} {pageToHref} {currPageNum} />
  </div>
{/if}
