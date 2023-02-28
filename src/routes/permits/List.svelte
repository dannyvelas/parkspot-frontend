<script lang="ts">
  import type { Permit, User } from "$lib/models";
  import { Request } from "$lib/api";
  import { isOk } from "$lib/functional";
  import { getLatestToken } from "$lib/auth";
  import Row from "./Row.svelte";

  // props
  export let user: User;
  export let permits: Array<Permit>;

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

      permits = permits.filter((p) => p.id != event.detail.id);

      alert(`Deleted permit ${event.detail.id}`);
    }
  };
</script>

<div class="flex flex-col gap-2">
  <div
    class="bg-black rounded text-white shadow-md flex flex-row justify-between px-2 lg:px-8 py-3"
  >
    <div class="text-xs basis-3" />
    <div class="text-xs hidden md:inline md:basis-12">ID</div>
    <div class="text-xs hidden md:inline md:basis-20">Resident ID</div>
    <div class="text-xs basis-20 md:basis-1/3">Vehicle</div>
    <div class="text-xs basis-20">License</div>
    <div class="text-xs basis-16">Status</div>
  </div>
  {#each permits as permit}
    <Row {permit} userRole={user.role} on:clickDelete={deletePermit} />
  {/each}
</div>
