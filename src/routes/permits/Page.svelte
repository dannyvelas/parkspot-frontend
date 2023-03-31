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
  import Modal, { getModal } from "$lib/components/Modal.svelte";
  import CreatePermit from "./CreatePermit.svelte";
  import EditPermit from "./EditPermit.svelte";
  import DeletePermit from "./DeletePermit.svelte";

  // props
  export let listName: permitList;
  export let permits: Result<ListWithMetadata<Permit>>;
  export let session: Session;
  export let search: string;
  export let pageNum: number;

  // model
  let editPermit: Permit | undefined;
  let deletePermit: Permit | undefined;

  // events
  const openEditModal = (event: CustomEvent<Permit>) => {
    editPermit = event.detail;
    getModal("edit")?.open();
  };

  const openCreateModal = () => {
    getModal("create")?.open();
  };

  const openDeleteModal = (event: CustomEvent<Permit>) => {
    deletePermit = event.detail;
    getModal("delete")?.open();
  };

  const updatePermit = (event: CustomEvent<Permit>) => {
    permits.data!.records = permits.data!.records.map((currPermit) => {
      if (currPermit.id === event.detail.id) {
        return event.detail;
      }
      return currPermit;
    });
  };

  const removePermit = (event: CustomEvent<Permit>) => {
    permits.data!.records = permits.data!.records.filter((p) => p.id != event.detail.id);
    getModal("delete")?.close();
  };
</script>

<header class="mb-4">
  <h1 class="text-base">{capitalize(listName)} Permits</h1>
  <div class="text-xs text-gray-400">{permits.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(permits)}
  {permits.message}
{:else if isOk(permits)}
  <Modal id="create">
    <CreatePermit user={session.user} />
  </Modal>
  <Modal id="edit">
    {#if editPermit}
      <EditPermit permit={editPermit} on:permitUpdated={updatePermit} />
    {/if}
  </Modal>
  <Modal id="delete">
    {#if deletePermit}
      <DeletePermit permit={deletePermit} on:permitDeleted={removePermit} />
    {/if}
  </Modal>
  <div class="flex flex-row gap-x-1 md:gap-x-4 mb-4">
    <Search {search} />
    <CreateBtn on:click={openCreateModal} />
  </div>
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
      {#each permits.data.records as permit (permit.id)}
        <Row
          {permit}
          userRole={session.user.role}
          on:clickDelete={openDeleteModal}
          on:clickEdit={openEditModal}
        />
      {/each}
    </svelte:fragment>
  </Table>
{/if}
