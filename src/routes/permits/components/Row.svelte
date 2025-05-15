<script lang="ts">
  import type { Permit } from "$lib/models";
  import { capitalize } from "$lib/strings";
  import { minimalDate, detailDate } from "$lib/time";
  import { createEventDispatcher } from "svelte";
  import Row from "$lib/components/Row.svelte";
  import Tag from "./Tag.svelte";

  // config
  const dispatch = createEventDispatcher();

  
  interface Props {
    // props
    permit: Permit;
    userRole: string;
  }

  let { permit, userRole }: Props = $props();
</script>

<Row>
  {#snippet cells()}
  
      <div class="text-xs text-zinc-800 hidden md:inline md:basis-12">{permit.id}</div>
      <div class="text-xs text-zinc-800 hidden md:inline md:basis-20">{permit.residentID}</div>
      <div class="text-xs text-zinc-800 basis-20 md:basis-1/3">
        <span class="hidden lg:inline">{capitalize(permit.color)}</span>
        <span>{capitalize(permit.make)}</span>
        <span class="hidden lg:inline">{capitalize(permit.model)}</span>
      </div>
      <div class="text-xs text-zinc-800 basis-20">{permit.licensePlate}</div>
      <Tag startDate={permit.startDate} endDate={permit.endDate} />
    
  {/snippet}
  {#snippet header()}
  
      <div class="text-xs font-bold">Permit {permit.id}</div>
      <div class="text-xs text-gray-500">
        {minimalDate(permit.startDate)} - {minimalDate(permit.endDate)}
      </div>
    
  {/snippet}
  <!-- @migration-task: migrate this slot by hand, `top-content` is an invalid identifier -->
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
  <!-- @migration-task: migrate this slot by hand, `middle-content` is an invalid identifier -->
  <div slot="middle-content" class:hidden={!permit.exceptionReason}>
    <div class="text-xs font-bold text-gray-500 mb-2">Exception Reason</div>
    <div class="text-xs">{permit.exceptionReason}</div>
  </div>
  <!-- @migration-task: migrate this slot by hand, `bottom-content` is an invalid identifier -->
  <div slot="bottom-content">
    <div class="text-xs font-bold text-gray-500">Requested Date</div>
    <div class="text-xs">
      {detailDate(new Date(permit.requestTS * 1000))}
    </div>
    <hr class="my-3" />
    <div class="flex flex-row justify-around">
      <a
        class="basis-20 border border-sky-500 rounded-md text-center text-sky-500"
        href="/permit/{permit.id}"
      >
        Reprint
      </a>
      {#if userRole === "admin"}
        <button
          class="basis-20 border border-green-500 rounded-md text-center text-green-500"
          onclick={() => dispatch("clickEdit", permit)}
        >
          Edit
        </button>
        <button
          class="basis-20 border border-rose-500 rounded-md text-center text-rose-500"
          onclick={() => dispatch("clickDelete", permit)}
        >
          Delete
        </button>
      {/if}
    </div>
  </div>
</Row>
