<script lang="ts">
  import { page } from "$app/stores";
  import Search from "$lib/components/Search.svelte";
  import Pagination from "$lib/components/Pagination.svelte";

  // props
  export let totalAmount: number;

  // model
  const lastSearch = $page.url.searchParams.get("search") || "";
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;
  let bannerError = "";

  // helpers
  const pageToHref = (pageNum: number) => {
    const searchParam = lastSearch === "" ? "" : `search=${lastSearch}&`;
    return `${$page.url.pathname}?${searchParam}page=${pageNum}`;
  };
</script>

{#if bannerError != ""}
  <div>
    <p>{bannerError}. Please try again later.</p>
  </div>
{/if}
<div class="flex flex-row gap-x-1 md:gap-x-4 mb-4">
  <Search twClasses="grow" {lastSearch} />
  <div class="flex flex-row items-center gap-x-2">
    <span class="text-xs text-green-400">Create</span>
    <iconify-icon icon="ph:plus-circle-bold" class="text-green-400" />
  </div>
</div>

<div class="flex flex-col gap-2">
  <div
    class="bg-black rounded text-white shadow-md flex flex-row justify-between px-2 lg:px-8 py-3"
  >
    <slot name="header-cells" />
  </div>
  <slot name="rows" />
</div>
<Pagination {totalAmount} {pageToHref} {currPageNum} />
