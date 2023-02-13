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
  const deletePermit = async (i: number, permitID: number) => {
    if (confirm(`Are you sure you want to delete ${permitID}?`)) {
      const delRes = await new Request()
        .setAccessToken(await getLatestToken())
        .delete(`api/permit/${permitID}`);
      if (!isOk(delRes)) {
        alert(`Error deleting permit ${permitID}. Please try again later`);
        return;
      }

      permits = [...permits.slice(0, i), ...permits.slice(i + 1)];

      alert(`Deleted permit ${permitID}`);
    }
  };
</script>

<div class="flex flex-col gap-2">
  <div
    class="bg-black rounded text-white shadow-md flex flex-row justify-between md:justify-start px-2 md:px-8 py-3"
  >
    <div class="text-xs basis-1/12" />
    <div class="text-xs hidden md:inline md:basis-1/6">ID</div>
    <div class="text-xs hidden md:inline md:basis-1/6 ">Resident ID</div>
    <div class="text-xs basis-1/4 md:basis-2/6">Vehicle</div>
    <div class="text-xs basis-1/4 md:basis-1/6">License</div>
    <div class="text-xs basis-1/4 md:basis-1/6 lg:basis-1/12">Status</div>
  </div>
  {#each permits as permit, i (permit.id)}
    <Row {permit} />
  {/each}
</div>
