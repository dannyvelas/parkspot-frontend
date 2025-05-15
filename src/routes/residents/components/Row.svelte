<script lang="ts">
  import type { Resident } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Row from "$lib/components/Row.svelte";

  // config
  const dispatch = createEventDispatcher();

  
  interface Props {
    // props
    resident: Resident;
  }

  let { resident }: Props = $props();

  // model
  let fullName = $derived(resident.firstName + " " + resident.lastName);

  // styles
  const twGreenStatus = "bg-green-200 text-green-500";
  const twRedStatus = "bg-rose-200 text-rose-500";
  let twPermissionColors = $derived(resident.unlimDays ? twGreenStatus : twRedStatus);
  let permissionText = $derived(resident.unlimDays ? "Unlimited" : "Limited");
</script>

<Row>
  {#snippet cells()}
  
      <div class="text-xs text-zinc-800 basis-20">{resident.id}</div>
      <div class="text-xs text-zinc-800 basis-32">{fullName}</div>
      <div class="hidden lg:inline lg:basis-24 lg:flex lg:flex-row">
        <span class="text-xs basis-16 {twPermissionColors} text-center rounded-lg py-0.5">
          {permissionText}
        </span>
      </div>
      <div class="text-xs text-zinc-800 basis-8">{resident.amtParkingDaysUsed}</div>
    
  {/snippet}
  {#snippet header()}
  
      <div class="text-xs font-bold">{fullName}</div>
      <div class="text-xs text-gray-500">{resident.phone}</div>
      <div class="text-xs text-gray-500">{resident.email}</div>
    
  {/snippet}
  <!-- @migration-task: migrate this slot by hand, `bottom-content` is an invalid identifier -->
  <div slot="bottom-content" class="flex flex-row justify-around">
    <button
      class="basis-20 border border-green-500 rounded-md text-center text-green-500"
      onclick={() => dispatch("clickEdit", resident)}
    >
      Edit
    </button>
    <button
      class="basis-20 border border-rose-500 rounded-md text-center text-rose-500"
      onclick={() => dispatch("clickDelete", resident)}
    >
      Delete
    </button>
  </div>
</Row>
