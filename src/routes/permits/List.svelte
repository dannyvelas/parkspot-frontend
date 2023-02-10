<script lang="ts">
  import type { Permit, User } from "$lib/models";
  import { Request } from "$lib/api";
  import { isOk } from "$lib/functional";
  import { capitalize } from "$lib/strings";
  import { getLatestToken } from "$lib/auth";

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

  // helpers
  const isActive = (p: Permit): boolean => {
    const now = new Date().getTime();
    return p.startDate.getTime() < now && p.endDate.getTime() > now;
  };

  const prettyDate = (d: Date): string => {
    let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    return `${mo}-${day}`;
  };

  const twGreenStatus = "bg-green-200 text-green-500";
  const twRedStatus = "bg-rose-200 text-rose-500";
</script>

<div
  class="bg-black rounded text-white mb-2 shadow-md flex flex-row justify-between md:justify-start px-2 md:px-8 py-3"
>
  <div class="text-xs basis-1/6">ID</div>
  <div class="text-xs hidden md:basis-1/6  md:inline">Resident ID</div>
  <div class="text-xs basis-1/4 md:basis-2/6">Vehicle</div>
  <div class="text-xs basis-1/4 md:basis-1/6">License</div>
  <div class="text-xs basis-1/4 md:basis-1/5 lg:basis-1/12">Status</div>
</div>
{#each permits as permit, i (permit.id)}
  <div
    class="bg-white rounded mb-2 shadow-md flex flex-row justify-between md:justify-start px-2 md:px-8 py-3"
  >
    <div class="text-xs text-zinc-800 basis-1/6">{permit.id}</div>
    <div class="text-xs text-zinc-800 hidden md:basis-1/6 md:inline">{permit.residentID}</div>
    <div class="text-xs text-zinc-800 basis-1/4 md:basis-2/6">
      <span class="hidden lg:inline">{capitalize(permit.color)}</span>
      {capitalize(permit.make)}
      <span class="hidden lg:inline">{capitalize(permit.model)}</span>
    </div>
    <div class="text-xs text-zinc-800 basis-1/4 md:basis-1/6">{permit.licensePlate}</div>
    <div
      class="{isActive(permit)
        ? twGreenStatus
        : twRedStatus} text-xs text-center rounded-lg basis-1/4 md:basis-1/5 lg:basis-1/12 py-0.5"
    >
      {isActive(permit) ? "Active" : "Expired"}
    </div>
  </div>
{/each}
