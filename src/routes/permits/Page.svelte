<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata, permitList } from "$lib/models";
  import type { Session } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/strings";
  import { page } from "$app/stores";
  import List from "./List.svelte";
  import Search from "$lib/components/Search.svelte";
  import Pagination from "$lib/components/Pagination.svelte";

  // props
  export let listName: permitList;
  export let permits: Result<ListWithMetadata<Permit>>;
  export let session: Session;
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // model
  let lastSearch = $page.url.searchParams.get("search") || "";
  let bannerError = "";

  // helpers
  const pageToHref = (pageNum: number) => {
    const searchParam = lastSearch === "" ? "" : `search=${lastSearch}&`;
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
    <Search twClasses="grow" {lastSearch} />
    <div class="flex flex-row items-center gap-x-2">
      <span class="text-xs text-green-400">Create Permit</span>
      <iconify-icon icon="ph:plus-circle-bold" class="text-green-400" />
    </div>
  </div>
  <List permits={permits.data.records} user={session.user} />
  <Pagination totalAmount={permits.data.metadata.totalAmount} {pageToHref} {currPageNum} />
{/if}
