<script lang="ts">
  import type { Car } from "$lib/models";
  import { capitalize } from "$lib/strings";
  import { createEventDispatcher } from "svelte";
  import Row from "$lib/components/Row.svelte";

  // config
  const dispatch = createEventDispatcher();

  
  interface Props {
    // props
    userRole: string;
    car: Car;
  }

  let { userRole, car }: Props = $props();
</script>

<Row>
  {#snippet cells()}
  
      <div class="text-xs text-zinc-800 basis-20">{car.residentID}</div>
      <div class="text-xs text-zinc-800 basis-20">{car.licensePlate}</div>
      <div class="text-xs text-zinc-800 hidden md:inline md:basis-20">{car.color}</div>
      <div class="text-xs text-zinc-800 hidden md:inline md:basis-20">{car.make}</div>
      <div class="text-xs text-zinc-800 hidden md:inline md:basis-20">{car.model}</div>
      <div class="text-xs text-zinc-800 basis-20 md:hidden">
        {capitalize(car.make)}
      </div>
    
  {/snippet}
  <!-- @migration-task: migrate this slot by hand, `top-content` is an invalid identifier -->
  <div slot="top-content" class="flex flex-row">
    <div class="basis-1/2 flex flex-col gap-1 truncate">
      <div class="text-xs font-bold text-gray-500 mb-2">Resident</div>
      <div class="text-xs truncate">{car.residentID}</div>
    </div>
    <div class="basis-1/2 flex flex-col gap-1 truncate">
      <div class="text-xs font-bold text-gray-500 mb-2 truncate">Vehicle</div>
      <div class="text-xs text-black truncate">
        {capitalize(car.color)}
        {capitalize(car.make)}
        {capitalize(car.model)}
      </div>
      <div class="text-xs text-gray-500 truncate">{car.licensePlate}</div>
    </div>
  </div>
  <!-- @migration-task: migrate this slot by hand, `bottom-content` is an invalid identifier -->
  <div slot="bottom-content" class="flex flex-row justify-around">
    {#if userRole === "resident" || userRole === "admin"}
      <button
        class="basis-20 border border-green-500 rounded-md text-center text-green-500"
        onclick={() => dispatch("clickEdit", car)}
      >
        Edit
      </button>
      <button
        class="basis-20 border border-rose-500 rounded-md text-center text-rose-500"
        onclick={() => dispatch("clickDelete", car)}
      >
        Delete
      </button>
    {/if}
  </div>
</Row>
