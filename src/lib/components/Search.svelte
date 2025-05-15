<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  
  interface Props {
    // props
    search: string;
  }

  let { search }: Props = $props();

  // model
  let currSearch = $state(search);

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
</script>

<!-- ref: https://flowbite.com/docs/forms/search-input/-->
<form class="grow" onsubmit={handleSearch}>
  <label class="relative block flex">
    <iconify-icon
      icon="heroicons:magnifying-glass-solid"
      class="absolute z-0 inset-y-0 left-0 text-green-400 pl-2 flex items-center"
></iconify-icon>
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
