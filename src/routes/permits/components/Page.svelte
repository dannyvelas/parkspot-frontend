<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Permit, ListWithMetadata, permitList } from "$lib/models";
  import type { Session } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/strings";
  import Row from "./Row.svelte";
  import Search from "$lib/components/Search.svelte";
  import CreateBtn from "$lib/components/CreateBtn.svelte";
  import Table from "$lib/components/Table.svelte";
  import ListModals, { openCreate, openEdit, openDelete } from "$lib/components/ListModals.svelte";
  import Create from "./Create.svelte";
  import Edit from "./Edit.svelte";
  import Delete from "./Delete.svelte";

  
  interface Props {
    // props
    listName: permitList;
    permits: Result<ListWithMetadata<Permit>>;
    session: Session;
    search: string;
    pageNum: number;
  }

  let {
    listName,
    permits = $bindable(),
    session,
    search,
    pageNum
  }: Props = $props();

  function refreshList() {
    // ListModals updates permits.data by ref; here we ask svelte to render such changes
    permits.data = permits.data;
  }
</script>

<header class="mb-4">
  <h1 class="text-base">{capitalize(listName)} Permits</h1>
  <div class="text-xs text-gray-400">{permits.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(permits)}
  {permits.message}
{:else if isOk(permits)}
  <ListModals
    list={permits.data}
    user={session.user}
    createModal={Create}
    editModal={Edit}
    deleteModal={Delete}
    on:modalUpdate={refreshList}
  />
  <div class="flex flex-row gap-x-1 md:gap-x-4 mb-4">
    <Search {search} />
    {#if session.user.role === "admin" || session.user.role === "resident"}
      <CreateBtn on:click={openCreate} />
    {/if}
  </div>
  <Table totalAmount={permits.data.metadata.totalAmount} {search} {pageNum}>
    <!-- @migration-task: migrate this slot by hand, `header-cells` is an invalid identifier -->
  <svelte:fragment slot="header-cells">
      <div class="text-xs basis-3"></div>
      <div class="text-xs hidden md:inline md:basis-12">ID</div>
      <div class="text-xs hidden md:inline md:basis-20">Resident ID</div>
      <div class="text-xs basis-20 md:basis-1/3">Vehicle</div>
      <div class="text-xs basis-20">License</div>
      <div class="text-xs basis-16">Status</div>
    </svelte:fragment>
    {#snippet rows()}
          
        {#each permits.data.records as permit (permit.id)}
          <Row
            {permit}
            userRole={session.user.role}
            on:clickDelete={openDelete}
            on:clickEdit={openEdit}
          />
        {/each}
      
          {/snippet}
  </Table>
{/if}
