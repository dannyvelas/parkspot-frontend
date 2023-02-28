<script lang="ts">
  import type { Resident } from "$lib/models";

  // props
  export let resident: Resident;
  export let userRole: string;

  // model
  let isExpanded = false;

  // styles
  const twGreenStatus = "bg-green-200 text-green-500";
  const twRedStatus = "bg-rose-200 text-rose-500";
  const twPermissionColors = resident.unlimDays ? twGreenStatus : twRedStatus;
  const permissionText = resident.unlimDays ? "Unlimited" : "Limited";
</script>

<div class="bg-white flex flex-col gap-2 rounded shadow-md px-2 lg:px-8 py-3">
  <div
    class="flex flex-row justify-between"
    on:click={() => (isExpanded = !isExpanded)}
    on:keypress={() => (isExpanded = !isExpanded)}
  >
    <div class="text-xs basis-3">
      {#if !isExpanded}
        <iconify-icon icon="material-symbols:keyboard-arrow-down-rounded" />
      {:else}
        <iconify-icon icon="material-symbols:keyboard-arrow-up-rounded" />
      {/if}
    </div>
    <div class="text-xs text-zinc-800 basis-14">{resident.id}</div>
    <div class="text-xs text-zinc-800 basis-32">{resident.firstName + " " + resident.lastName}</div>
    <div class="hidden lg:inline lg:basis-24 lg:flex lg:flex-row">
      <span class="text-xs basis-16 {twPermissionColors} text-center rounded-lg py-0.5">
        {permissionText}
      </span>
    </div>
    <div class="text-xs text-zinc-800 basis-8">{resident.amtParkingDaysUsed}</div>
  </div>
</div>
