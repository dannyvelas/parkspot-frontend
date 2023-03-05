<script lang="ts">
  import type { Permit } from "$lib/models";
  import { capitalize } from "$lib/strings";
  import { minimalDate, detailDate } from "$lib/time";
  import { createEventDispatcher } from "svelte";
  import Row from "$lib/components/Row.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let permit: Permit;
  export let userRole: string;

  // model
  const now = new Date().getTime();
  const isActive = permit.startDate.getTime() < now && permit.endDate.getTime() > now;

  // styles
  const twGreenStatus = "bg-green-200 text-green-500";
  const twRedStatus = "bg-rose-200 text-rose-500";
</script>

<Row>
  <svelte:fragment slot="cells">
    <div class="text-xs text-zinc-800 hidden md:inline md:basis-12">{permit.id}</div>
    <div class="text-xs text-zinc-800 hidden md:inline md:basis-20">{permit.residentID}</div>
    <div class="text-xs text-zinc-800 basis-20 md:basis-1/3">
      <span class="hidden lg:inline">{capitalize(permit.color)}</span>
      <span>{capitalize(permit.make)}</span>
      <span class="hidden lg:inline">{capitalize(permit.model)}</span>
    </div>
    <div class="text-xs text-zinc-800 basis-20">{permit.licensePlate}</div>
    <div
      class="{isActive
        ? twGreenStatus
        : twRedStatus} text-xs text-center rounded-lg basis-16 py-0.5"
    >
      {isActive ? "Active" : "Expired"}
    </div>
  </svelte:fragment>
  <svelte:fragment slot="header">
    <div class="text-xs font-bold">Permit {permit.id}</div>
    <div class="text-xs text-gray-500">
      {minimalDate(permit.startDate)} - {minimalDate(permit.endDate)}
    </div>
  </svelte:fragment>
  <div slot="top-content" class="flex flex-row">
    <div class="basis-1/2 flex flex-col gap-1 truncate">
      <div class="text-xs font-bold text-gray-500 mb-2">Resident</div>
      <div class="text-xs truncate">{permit.residentID}</div>
    </div>
    <div class="basis-1/2 flex flex-col gap-1 truncate">
      <div class="text-xs font-bold text-gray-500 mb-2 truncate">Vehicle</div>
      <div class="text-xs text-black truncate">
        {capitalize(permit.color)}
        {capitalize(permit.make)}
      </div>
      <div class="text-xs text-gray-500 truncate">{capitalize(permit.model)}</div>
      <div class="text-xs text-gray-500 truncate">{permit.licensePlate}</div>
    </div>
  </div>
  <div slot="middle-content" class:hidden={!permit.exceptionReason}>
    <div class="text-xs font-bold text-gray-500 mb-2">Exception Reason</div>
    <div class="text-xs">{permit.exceptionReason}</div>
  </div>
  <div slot="bottom-content">
    <div class="text-xs font-bold text-gray-500">Requested Date</div>
    <div class="text-xs">
      {detailDate(new Date(permit.requestTS * 1000))}
    </div>
    <hr class="my-3" />
    <div class="flex flex-row justify-around">
      <a
        class="basis-20 border border-sky-500 rounded-md text-center text-sky-500"
        href="/permit/{permit.id}/display"
      >
        Reprint
      </a>
      {#if userRole === "admin"}
        <button
          class="basis-20 border border-green-500 rounded-md text-center text-green-500"
          on:click={() => dispatch("clickEdit", permit)}
        >
          Edit
        </button>
        <button
          class="basis-20 border border-rose-500 rounded-md text-center text-rose-500"
          on:click={() => dispatch("clickDelete", permit)}
        >
          Delete
        </button>
      {/if}
    </div>
  </div>
</Row>
