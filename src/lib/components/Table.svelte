<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Pagination from "$lib/components/Pagination.svelte";

  // props
  export let totalAmount: number;
  export let search: string;
  export let pageNum: number;

  // model
  let currSearch = search;
  let bannerError = "";

  // events
  const handleSearch = async () => {
    if (currSearch === search) {
      return;
    }

    if (currSearch === "") {
      goto("?");
      return;
    }

    let query = new URLSearchParams($page.url.searchParams);
    query.set("search", currSearch);
    query.delete("page"); // searches will purposely erase the state of the current page number
    goto(`?${query.toString()}`);
  };

  // helpers
  const pageToHref = (pageNum: number) => {
    const searchParam = search === "" ? "" : `search=${search}&`;
    return `${$page.url.pathname}?${searchParam}page=${pageNum}`;
  };
</script>

{#if bannerError != ""}
  <div>
    <p>{bannerError}. Please try again later.</p>
  </div>
{/if}
<div class="flex flex-row gap-x-1 md:gap-x-4 mb-4">
  <form class="grow" on:submit={handleSearch}>
    <label class="relative block flex">
      <iconify-icon
        icon="heroicons:magnifying-glass-solid"
        class="absolute z-0 inset-y-0 left-0 text-green-400 pl-2 flex items-center"
      />
      <input
        class="grow pl-7 py-2 bg-white rounded-2xl border border-slate-300 text-xs placeholder:text-slate-400 placeholder:text-xs focus:outline-none"
        placeholder="Search"
        type="text"
        name="search"
        maxlength="100"
        bind:value={currSearch}
      />
      <input
        class="absolute z-0 inset-y-1 right-1 rounded-2xl bg-green-400 text-white text-xs px-6"
        type="submit"
        value="Go"
      />
    </label>
  </form>

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
<Pagination {totalAmount} {pageNum} {pageToHref} />
