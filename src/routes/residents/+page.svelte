<script lang="ts">
  import type { PageData } from "./$types";
  import { isOk } from "$lib/functional";
  import Row from "./components/Row.svelte";
  import Search from "$lib/components/Search.svelte";
  import CreateBtn from "$lib/components/CreateBtn.svelte";
  import Table from "$lib/components/Table.svelte";
  import ListModals, { openCreate, openEdit, openDelete } from "$lib/components/ListModals.svelte";
  import Create from "./components/Create.svelte";
  import Edit from "./components/Edit.svelte";
  import Delete from "./components/Delete.svelte";

  // props
  export let data: PageData;

  function refreshList() {
    // ListModals updates permits.data by ref; here we ask svelte to render such changes
    data.residents.data = data.residents.data;
  }
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
  <ListModals
    list={data.residents.data}
    user={data.session.user}
    createModal={Create}
    editModal={Edit}
    deleteModal={Delete}
    on:modalUpdate={refreshList}
  />
  <div class="flex flex-row gap-x-1 md:gap-x-4 mb-4">
    <Search search={data.search} />
    <CreateBtn on:click={openCreate} />
  </div>
  <Table
    totalAmount={data.residents.data.metadata.totalAmount}
    search={data.search}
    pageNum={data.pageNum}
  >
    <svelte:fragment slot="header-cells">
      <div class="text-xs basis-3" />
      <div class="text-xs basis-20">ID</div>
      <div class="text-xs basis-32">Name</div>
      <div class="text-xs hidden lg:inline lg:basis-24">Unlimited Days?</div>
      <div class="text-xs basis-8">Days Used</div>
    </svelte:fragment>
    <svelte:fragment slot="rows">
      {#each data.residents.data.records as resident (resident.id)}
        <Row {resident} on:clickDelete={openDelete} on:clickEdit={openEdit} />
      {/each}
    </svelte:fragment>
  </Table>
{/if}
