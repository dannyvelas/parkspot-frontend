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

  const getTWColors = (isActive: boolean): string => {
    if (isActive) {
      return "bg-green-200 text-green-500";
    } else {
      return "bg-rose-200 text-rose-500";
    }
  };
</script>

<div class="bg-black rounded text-white mb-2 shadow-md flex flex-row px-4 md:px-8 py-3">
  <span class="text-xs basis-1/6">ID</span>
  <span class="text-xs md:basis-1/6 hidden md:inline">Resident ID</span>
  <span class="text-xs basis-1/4 md:basis-2/6">Vehicle</span>
  <span class="text-xs basis-1/4 md:basis-1/6">License</span>
  <span class="text-xs basis-1/4 md:basis-1/6">Status</span>
</div>
{#each permits as permit, i (permit.id)}
  <div class="bg-white rounded mb-2 shadow-md flex flex-row px-4 md:px-8 py-3">
    <span class="text-xs basis-1/6 md:basis-1/6 text-zinc-800">{permit.id}</span>
    <span class="text-xs basis-1/6 text-zinc-800 hidden md:inline">{permit.residentID}</span>
    <span class="text-xs basis-1/4 md:basis-2/6 text-zinc-800">
      <span class="hidden lg:inline">{capitalize(permit.color)}</span>
      {capitalize(permit.make)}
      <span class="hidden lg:inline">{capitalize(permit.model)}</span>
    </span>
    <span class="text-xs basis-1/4 md:basis-1/6 text-zinc-800">{permit.licensePlate}</span>
    <div class="basis-1/3 md:basis-1/6 flex justify-start">
      <span class="{getTWColors(isActive(permit))} text-xs basis-1/2 text-center rounded-lg py-0.5"
        >{isActive(permit) ? "Active" : "Expired"}
      </span>
    </div>
  </div>
{/each}
