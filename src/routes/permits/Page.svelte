<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata, permitList } from "$lib/models";
  import type { Session } from "$lib/auth";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/strings";
  import { page } from "$app/stores";
  import Row from "./Row.svelte";
  import Search from "$lib/components/Search.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import TableHeader from "$lib/components/TableHeader.svelte";

  // props
  export let listName: permitList;
  export let permits: Result<ListWithMetadata<Permit>>;
  export let session: Session;
  const currPageNum = Number($page.url.searchParams.get("page")) || 1;

  // model
  let lastSearch = $page.url.searchParams.get("search") || "";
  let bannerError = "";

  // events
  const deletePermit = async (event: CustomEvent<Permit>) => {
    if (confirm(`Are you sure you want to delete ${event.detail.id}?`)) {
      const delRes = await new Request()
        .setAccessToken(await getLatestToken())
        .delete(`api/permit/${event.detail.id}`);
      if (!isOk(delRes)) {
        alert(`Error deleting permit ${event.detail.id}. Please try again later`);
        return;
      }

      permits.data!.records = permits.data!.records.filter((p) => p.id != event.detail.id);

      alert(`Deleted permit ${event.detail.id}`);
    }
  };

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
  <div class="flex flex-row gap-x-1 md:gap-x-4 mb-4">
    <Search twClasses="grow" {lastSearch} />
    <div class="flex flex-row items-center gap-x-2">
      <span class="text-xs text-green-400">Create</span>
      <iconify-icon icon="ph:plus-circle-bold" class="text-green-400" />
    </div>
  </div>

  <div class="flex flex-col gap-2">
    <TableHeader>
      <div class="text-xs basis-3" />
      <div class="text-xs hidden md:inline md:basis-12">ID</div>
      <div class="text-xs hidden md:inline md:basis-20">Resident ID</div>
      <div class="text-xs basis-20 md:basis-1/3">Vehicle</div>
      <div class="text-xs basis-20">License</div>
      <div class="text-xs basis-16">Status</div>
    </TableHeader>
    {#each permits.data.records as permit}
      <Row {permit} userRole={session.user.role} on:clickDelete={deletePermit} />
    {/each}
  </div>
  <Pagination totalAmount={permits.data.metadata.totalAmount} {pageToHref} {currPageNum} />
{/if}
