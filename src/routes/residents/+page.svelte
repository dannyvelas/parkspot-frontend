<script lang="ts">
  import type { PageData } from "./$types";
  import type { Resident } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { Request } from "$lib/api";
  import { page } from "$app/stores";
  import { getLatestToken } from "$lib/auth";
  import Pagination from "$lib/components/Pagination.svelte";
  import Search from "$lib/components/Search.svelte";
  import Row from "./Row.svelte";

  // props
  export let data: PageData;
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // model
  let lastSearch = $page.url.searchParams.get("search") || "";
  let bannerError = "";

  // events
  const deleteResident = async (event: CustomEvent<Resident>) => {
    if (confirm(`Are you sure you want to delete ${event.detail.id}?`)) {
      const delRes = await new Request()
        .setAccessToken(await getLatestToken())
        .delete(`api/resident/${event.detail.id}`);
      if (!isOk(delRes)) {
        alert(`Error deleting resident ${event.detail.id}. Please try again later`);
        return;
      }

      data.residents.data!.records = data.residents.data!.records.filter(
        (r) => r.id != event.detail.id
      );
      data.residents.data!.metadata.totalAmount = data.residents.data!.metadata.totalAmount - 1;

      alert(`Deleted resident ${event.detail.id}`);
    }
  };

  // helpers
  const pageToHref = (pageNum: number) => {
    const searchParam = lastSearch === "" ? "" : `search=${lastSearch}&`;
    return `/residents?${searchParam}page=${pageNum}`;
  };
</script>

<svelte:head>
  <title>Residents</title>
</svelte:head>

<header class="mb-4">
  <h1 class="text-base">Residents</h1>
  <div class="text-xs text-gray-400">{data.residents.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(data.residents)}
  {data.residents.message}
{:else}
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
  <div class="flex flex-col gap-2">
    <div
      class="bg-black rounded text-white shadow-md flex flex-row justify-between px-2 lg:px-8 py-3"
    >
      <div class="text-xs basis-3" />
      <div class="text-xs basis-14">ID</div>
      <div class="text-xs basis-32">Name</div>
      <div class="text-xs hidden lg:inline lg:basis-24">Unlimited Days?</div>
      <div class="text-xs basis-8">Days</div>
    </div>
    {#each data.residents.data.records as resident}
      <Row {resident} userRole={data.session.user.role} on:clickDelete={deleteResident} />
    {/each}
  </div>
  <Pagination totalAmount={data.residents.data.metadata.totalAmount} {pageToHref} {currPageNum} />
{/if}
