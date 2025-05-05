<script lang="ts" context="module">
  interface Item {
    id: string | number;
  }

  export let openCreate = () => {};
  export let openEdit = (_: CustomEvent<Item>) => {};
  export let openDelete = (_: CustomEvent<Item>) => {};
</script>

<script lang="ts">
  import type { ComponentType, SvelteComponent } from "svelte";
  import type { ListWithMetadata, User } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Modal, { getModal } from "$lib/components/Modal.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  type T = $$Generic;
  export let user: User;
  export let list: ListWithMetadata<Item>;
  export let createModal: ComponentType<SvelteComponent<any, { created: CustomEvent<Item> }>>;
  export let editModal:
    | ComponentType<SvelteComponent<{ item: T }, { updated: CustomEvent }>>
    | undefined;
  export let deleteModal: ComponentType<
    SvelteComponent<{ item: T }, { deleted: CustomEvent<Item> }>
  >;

  // model
  let editItem: Item | undefined;
  let deleteItem: Item | undefined;

  // API: modal open events
  openCreate = () => {
    getModal("create")?.open();
  };
  openEdit = (event: CustomEvent<Item>) => {
    editItem = event.detail;
    getModal("edit")?.open();
  };
  openDelete = (event: CustomEvent<Item>) => {
    deleteItem = event.detail;
    getModal("delete")?.open();
  };

  // modal dispatch events
  const addItem = (event: CustomEvent<Item>) => {
    list.records = [event.detail, ...list.records];
    list.metadata.totalAmount = list.metadata.totalAmount + 1;
    getModal("create")?.close();
    dispatch("modalUpdate");
  };
  const updateItem = () => {
    // no need to update item; it should have already been updated by ref in editModal comp
    dispatch("modalUpdate");
  };
  const removeItem = (event: CustomEvent<Item>) => {
    list.records = list.records.filter((p) => p.id != event.detail.id);
    list.metadata.totalAmount = list.metadata.totalAmount - 1;
    getModal("delete")?.close();
    dispatch("modalUpdate");
  };
</script>

<Modal id="create">
  <svelte:component this={createModal} {user} on:created={addItem} />
</Modal>
<Modal id="edit">
  {#if editItem}
    <svelte:component this={editModal} item={editItem} on:updated={updateItem} />
  {/if}
</Modal>
<Modal id="delete">
  {#if deleteItem}
    <svelte:component this={deleteModal} item={deleteItem} on:deleted={removeItem} />
  {/if}
</Modal>
