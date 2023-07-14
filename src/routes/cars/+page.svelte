<script lang="ts">
  import type { PageData } from "./$types";
  import { isOk } from "$lib/functional";
  import Row from "./components/Row.svelte";
  import Search from "$lib/components/Search.svelte";
  import CreateBtn from "$lib/components/CreateBtn.svelte";
  import Table from "$lib/components/Table.svelte";
  import ListModals, { openCreate, openDelete, openEdit } from "$lib/components/ListModals.svelte";
  import Create from "./components/Create.svelte";
  import Delete from "./components/Delete.svelte";
  import Edit from "./components/Edit.svelte";

  // props
  export let data: PageData;

  function refreshList() {
    // ListModals updates permits.data by ref; here we ask svelte to render such changes
    data.cars.data = data.cars.data;
  }
</script>

<svelte:head>
  <title>Cars</title>
</svelte:head>

<header class="mb-4">
  <h1 class="text-base">Cars</h1>
  <div class="text-xs text-gray-400">{data.cars.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(data.cars)}
  {data.cars.message}
{:else}
  <ListModals
    list={data.cars.data}
    user={data.session.user}
    createModal={Create}
    editModal={Edit}
    deleteModal={Delete}
    on:modalUpdate={refreshList}
  />
  <div class="flex flex-row gap-x-1 md:gap-x-4 mb-4">
    <Search search={data.search} />
    {#if data.session.user.role === "admin" || data.session.user.role === "resident"}
      <CreateBtn on:click={openCreate} />
    {/if}
  </div>
  <Table
    totalAmount={data.cars.data.metadata.totalAmount}
    search={data.search}
    pageNum={data.pageNum}
  >
    <svelte:fragment slot="header-cells">
      <div class="text-xs basis-3" />
      <div class="text-xs basis-20">Resident ID</div>
      <div class="text-xs basis-20">License</div>
      <div class="text-xs hidden md:inline md:basis-20">Color</div>
      <div class="text-xs hidden md:inline md:basis-20">Make</div>
      <div class="text-xs hidden md:inline md:basis-20">Model</div>
      <div class="text-xs basis-20 md:hidden">Vehicle</div>
    </svelte:fragment>
    <svelte:fragment slot="rows">
      {#each data.cars.data.records as car (car.id)}
        <Row
          {car}
          userRole={data.session.user.role}
          on:clickDelete={openDelete}
          on:clickEdit={openEdit}
        />
      {/each}
    </svelte:fragment>
  </Table>
{/if}
