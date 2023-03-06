<script lang="ts">
  import type { PageData } from "./$types";
  import type { Resident } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import Row from "./Row.svelte";
  import Table from "$lib/components/Table.svelte";

  // props
  export let data: PageData;

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
  <Table totalAmount={data.residents.data.metadata.totalAmount}>
    <svelte:fragment slot="header-cells">
      <div class="text-xs basis-3" />
      <div class="text-xs basis-20">ID</div>
      <div class="text-xs basis-32">Name</div>
      <div class="text-xs hidden lg:inline lg:basis-24">Unlimited Days?</div>
      <div class="text-xs basis-8">Days</div>
    </svelte:fragment>
    <svelte:fragment slot="rows">
      {#each data.residents.data.records as resident}
        <Row {resident} on:clickDelete={deleteResident} />
      {/each}
    </svelte:fragment>
  </Table>
{/if}
