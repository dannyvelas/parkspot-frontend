<script lang="ts">
  import type { Resident } from "$lib/models";
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let resident: Resident;

  // model
  const fullName = resident.firstName + " " + resident.lastName;
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
    <div class="text-xs text-zinc-800 basis-32">{fullName}</div>
    <div class="hidden lg:inline lg:basis-24 lg:flex lg:flex-row">
      <span class="text-xs basis-16 {twPermissionColors} text-center rounded-lg py-0.5">
        {permissionText}
      </span>
    </div>
    <div class="text-xs text-zinc-800 basis-8">{resident.amtParkingDaysUsed}</div>
  </div>
  {#if isExpanded}
    <div transition:slide|local class="flex flex-col gap-y-5">
      <div>
        <div class="text-xs font-bold">{fullName}</div>
        <div class="text-xs text-gray-500">{resident.phone}</div>
        <div class="text-xs text-gray-500">{resident.email}</div>
        <hr class="my-3" />
      </div>
      <div>
        <div class="flex flex-row justify-around">
          <a
            class="basis-20 border border-sky-500 rounded-md text-center text-sky-500"
            href="/resident/{resident.id}/display"
            data-sveltekit-reload
          >
            Reprint
          </a>
          <button
            class="basis-20 border border-green-500 rounded-md text-center text-green-500"
            on:click={() => dispatch("clickEdit", resident)}
          >
            Edit
          </button>
          <button
            class="basis-20 border border-rose-500 rounded-md text-center text-rose-500"
            on:click={() => dispatch("clickDelete", resident)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
