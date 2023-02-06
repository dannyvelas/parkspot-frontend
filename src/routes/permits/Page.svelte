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
    if (searchVal === $page.url.searchParams.get("search")) {
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

<header class="mb-4">
  <h1 class="text-base">{capitalize(listName)} Permits</h1>
  <div class="text-xs text-gray-400">{permits.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(permits)}
  {permits.message}
{:else if isOk(permits)}
  <div>
    {#if bannerError != ""}
      <div>
        <p>{bannerError}. Please try again later.</p>
      </div>
    {/if}
    <div class="flex flex-row gap-x-4">
      <div class="grow flex flex-row items-center bg-white rounded-lg border border-green-400">
        <iconify-icon icon="heroicons:magnifying-glass-solid" class="text-green-400 mx-1" />
        <input
          class="grow p-1 bg-white placeholder:text-slate-400 placeholder:text-xs focus:outline-none"
          placeholder="Search"
          type="text"
          name="search"
        />
      </div>
      <div class="flex flex-row items-center gap-x-2">
        <span class="text-xs text-green-400">Create New Permit</span>
        <iconify-icon icon="ph:plus-circle-bold" class="text-green-400" />
      </div>
    </div>
    <List
      {listName}
      permits={permits.data.records}
      totalAmount={permits.data.metadata.totalAmount}
      user={session.user}
    />
    <Pagination totalAmount={permits.data.metadata.totalAmount} {pageToHref} {currPageNum} />
  </div>
  <!--
      <input
        class="grow rounded-lg border border-green-400"
        type="text"
        bind:value={searchVal}
        placeholder="Search"
      />
      -->
{/if}
