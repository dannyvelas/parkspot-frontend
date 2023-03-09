<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata, permitList } from "$lib/models";
  import type { Session } from "$lib/auth";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/strings";
  import Row from "./Row.svelte";
  import Table from "$lib/components/Table.svelte";

  // props
  export let listName: permitList;
  export let permits: Result<ListWithMetadata<Permit>>;
  export let session: Session;
  export let search: string;
  export let pageNum: number;

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
</script>

<header class="mb-4">
  <h1 class="text-base">{capitalize(listName)} Permits</h1>
  <div class="text-xs text-gray-400">{permits.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(permits)}
  {permits.message}
{:else if isOk(permits)}
  <Table totalAmount={permits.data.metadata.totalAmount} {search} {pageNum}>
    <svelte:fragment slot="header-cells">
      <div class="text-xs basis-3" />
      <div class="text-xs hidden md:inline md:basis-12">ID</div>
      <div class="text-xs hidden md:inline md:basis-20">Resident ID</div>
      <div class="text-xs basis-20 md:basis-1/3">Vehicle</div>
      <div class="text-xs basis-20">License</div>
      <div class="text-xs basis-16">Status</div>
    </svelte:fragment>
    <svelte:fragment slot="rows">
      {#each permits.data.records as permit}
        <Row {permit} userRole={session.user.role} on:clickDelete={deletePermit} />
      {/each}
    </svelte:fragment>
  </Table>
{/if}
