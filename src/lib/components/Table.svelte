<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script lang="ts">
  import { page } from "$app/stores";
  import Pagination from "$lib/components/Pagination.svelte";

  // props
  export let totalAmount: number;
  export let search: string;
  export let pageNum: number;

  // model
  let bannerError = "";

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

<div class="flex flex-col gap-2">
  <div
    class="bg-black rounded text-white shadow-md flex flex-row justify-between px-2 lg:px-8 py-3"
  >
    <slot name="header-cells" />
  </div>
  <slot name="rows" />
</div>
<Pagination {totalAmount} {pageNum} {pageToHref} />
