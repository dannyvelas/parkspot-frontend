<script lang="ts">
  import type { Permit } from "$lib/models";
  import { capitalize } from "$lib/strings";

  // props
  export let permit: Permit;

  // model
  const now = new Date().getTime();
  const isActive = permit.startDate.getTime() < now && permit.endDate.getTime() > now;
  let isOpen = false;

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

<div>
  <div
    class="bg-white rounded mb-2 shadow-md flex flex-row justify-between md:justify-start px-2 md:px-8 py-3"
  >
    <div class="text-xs basis-1/12">
      <button on:click={() => (isOpen = !isOpen)}>
        <iconify-icon icon="material-symbols:keyboard-arrow-down-rounded" />
      </button>
    </div>
    <div class="text-xs text-zinc-800 hidden md:inline md:basis-1/6">{permit.id}</div>
    <div class="text-xs text-zinc-800 hidden md:inline md:basis-1/6">{permit.residentID}</div>
    <div class="text-xs text-zinc-800 basis-1/4 md:basis-2/6">
      <span class="hidden lg:inline">{capitalize(permit.color)}</span>
      {capitalize(permit.make)}
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
</div>
