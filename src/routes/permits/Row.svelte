<script lang="ts">
  import type { Permit } from "$lib/models";
  import { capitalize } from "$lib/strings";
  import { slide } from "svelte/transition";

  // props
  export let permit: Permit;

  // model
  const now = new Date().getTime();
  const isActive = permit.startDate.getTime() < now && permit.endDate.getTime() > now;
  let isExpanded = false;

  // helpers
  const prettyDate = (d: Date): string => {
    const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    return `${mo}-${day}`;
  };

  // styles
  const twGreenStatus = "bg-green-200 text-green-500";
  const twRedStatus = "bg-rose-200 text-rose-500";
</script>

<div class="bg-white flex flex-col gap-2 rounded shadow-md px-2 md:px-8 py-3">
  <div
    class="flex flex-row justify-between md:justify-start"
    on:click={() => (isExpanded = !isExpanded)}
    on:keypress={() => (isExpanded = !isExpanded)}
  >
    <div class="text-xs basis-1/12">
      {#if !isExpanded}
        <iconify-icon icon="material-symbols:keyboard-arrow-down-rounded" />
      {:else}
        <iconify-icon icon="material-symbols:keyboard-arrow-up-rounded" />
      {/if}
    </div>
    <div class="text-xs text-zinc-800 hidden md:inline md:basis-1/6">{permit.id}</div>
    <div class="text-xs text-zinc-800 hidden md:inline md:basis-1/6">{permit.residentID}</div>
    <div class="text-xs text-zinc-800 basis-1/4 md:basis-2/6">
      <span class="hidden lg:inline">{capitalize(permit.color)}</span>
      <span>{capitalize(permit.make)}</span>
      <span class="hidden lg:inline">{capitalize(permit.model)}</span>
    </div>
    <div class="text-xs text-zinc-800 basis-1/4 md:basis-1/6">{permit.licensePlate}</div>
    <div
      class="{isActive
        ? twGreenStatus
        : twRedStatus} text-xs text-center rounded-lg basis-1/4 md:basis-1/6 lg:basis-1/12 py-0.5"
    >
      {isActive ? "Active" : "Expired"}
    </div>
  </div>
  {#if isExpanded}
    <div transition:slide>
      <div class="text-xs font-bold">Permit {permit.id}</div>
      <div class="text-xs text-gray-500">
        {prettyDate(permit.startDate)} - {prettyDate(permit.endDate)}
      </div>
      <hr class="my-3" />
      <div class="flex flex-row">
        <div class="basis-1/2 flex flex-col gap-1 truncate">
          <div class="text-xs text-gray-500 mb-2">Resident</div>
          <div class="text-xs text-black truncate">Atticus Finch</div>
          <div class="text-xs text-gray-500 truncate">atticus.finch@gmail.com</div>
          <div class="text-xs text-gray-500 truncate">{permit.residentID}</div>
        </div>
        <div class="basis-1/2 flex flex-col gap-1 truncate">
          <div class="text-xs text-gray-500 mb-2 truncate">Vehicle</div>
          <div class="text-xs text-black truncate">
            {capitalize(permit.color)}
            {capitalize(permit.make)}
          </div>
          <div class="text-xs text-gray-500 truncate">{capitalize(permit.model)}</div>
          <div class="text-xs text-gray-500 truncate">{permit.licensePlate}</div>
        </div>
      </div>
    </div>
  {/if}
</div>
