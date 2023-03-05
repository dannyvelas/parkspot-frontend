<script lang="ts">
  import type { Resident } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Row from "$lib/components/Row.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let resident: Resident;

  // model
  const fullName = resident.firstName + " " + resident.lastName;

  // styles
  const twGreenStatus = "bg-green-200 text-green-500";
  const twRedStatus = "bg-rose-200 text-rose-500";
  const twPermissionColors = resident.unlimDays ? twGreenStatus : twRedStatus;
  const permissionText = resident.unlimDays ? "Unlimited" : "Limited";
</script>

<Row>
  <svelte:fragment slot="cells">
    <div class="text-xs text-zinc-800 basis-20">{resident.id}</div>
    <div class="text-xs text-zinc-800 basis-32">{fullName}</div>
    <div class="hidden lg:inline lg:basis-24 lg:flex lg:flex-row">
      <span class="text-xs basis-16 {twPermissionColors} text-center rounded-lg py-0.5">
        {permissionText}
      </span>
    </div>
    <div class="text-xs text-zinc-800 basis-8">{resident.amtParkingDaysUsed}</div>
  </svelte:fragment>
  <svelte:fragment slot="header">
    <div class="text-xs font-bold">{fullName}</div>
    <div class="text-xs text-gray-500">{resident.phone}</div>
    <div class="text-xs text-gray-500">{resident.email}</div>
  </svelte:fragment>
  <div slot="bottom-content" class="flex flex-row justify-around">
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
</Row>
