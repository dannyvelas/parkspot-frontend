<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata, permitList } from "$lib/models";
  import type { Session } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/strings";
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
  {#if bannerError != ""}
    <div>
      <p>{bannerError}. Please try again later.</p>
    </div>
  {/if}
  <div class="flex flex-row gap-x-4 mb-4">
    <label class="relative block grow flex">
      <iconify-icon
        icon="heroicons:magnifying-glass-solid"
        class="absolute inset-y-0 left-0 text-green-400 pl-2 flex items-center"
      />
      <input
        class="grow pl-7 py-2 bg-white rounded-2xl border border-slate-300 text-xs placeholder:text-slate-400 placeholder:text-xs focus:outline-none"
        placeholder="Search"
        type="text"
        name="search"
        maxlength="100"
        bind:value={searchVal}
      />
      <button
        class="absolute inset-y-1 right-1 rounded-2xl bg-green-400 text-white text-xs px-6"
        on:click={handleSearch}
      >
        Go
      </button>
    </label>
    <div class="flex flex-row items-center gap-x-2">
      <span class="text-xs text-green-400">Create New Permit</span>
      <iconify-icon icon="ph:plus-circle-bold" class="text-green-400" />
    </div>
  </div>
  <List permits={permits.data.records} user={session.user} />
  <Pagination totalAmount={permits.data.metadata.totalAmount} {pageToHref} {currPageNum} />
{/if}
