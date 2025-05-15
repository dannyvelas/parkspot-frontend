<script lang="ts">
  import type { PageData } from "./$types";
  import { isOk } from "$lib/functional";
  import Row from "./components/Row.svelte";
  import Search from "$lib/components/Search.svelte";
  import CreateBtn from "$lib/components/CreateBtn.svelte";
  import Table from "$lib/components/Table.svelte";
  import ListModals, { openCreate, openDelete } from "$lib/components/ListModals.svelte";
  import Create from "./components/Create.svelte";
  import Delete from "./components/Delete.svelte";

  
  interface Props {
    // props
    data: PageData;
  }

  let { data = $bindable() }: Props = $props();

  function refreshList() {
    // ListModals updates permits.data by ref; here we ask svelte to render such changes
    data.visitors.data = data.visitors.data;
  }
</script>

<svelte:head>
  <title>Visitors</title>
</svelte:head>

<header class="mb-4">
  <h1 class="text-base">Visitors</h1>
  <div class="text-xs text-gray-400">{data.visitors.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(data.visitors)}
  {data.visitors.message}
{:else}
  <ListModals
    list={data.visitors.data}
    user={data.session.user}
    createModal={Create}
    editModal={undefined}
    deleteModal={Delete}
    on:modalUpdate={refreshList}
  />
  <div class="flex flex-row gap-x-1 md:gap-x-4 mb-4">
    <Search search={data.search} />
    {#if data.session.user.role === "resident"}
      <CreateBtn on:click={openCreate} />
    {/if}
  </div>
  <Table
    totalAmount={data.visitors.data.metadata.totalAmount}
    search={data.search}
    pageNum={data.pageNum}
  >
    <!-- @migration-task: migrate this slot by hand, `header-cells` is an invalid identifier -->
  <svelte:fragment slot="header-cells">
      <div class="text-xs basis-3"></div>
      <div class="text-xs basis-32">Name</div>
      <div class="text-xs basis-20">Resident ID</div>
      <div class="text-xs hidden md:inline md:basis-20">Relation</div>
    </svelte:fragment>
    {#snippet rows()}
      
        {#each data.visitors.data.records as visitor (visitor.id)}
          <Row {visitor} userRole={data.session.user.role} on:clickDelete={openDelete} />
        {/each}
      
      {/snippet}
  </Table>
{/if}
