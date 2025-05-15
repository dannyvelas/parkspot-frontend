<script lang="ts">
  import type { Visitor } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import { monthDayYearDate } from "$lib/time";
  import Row from "$lib/components/Row.svelte";

  // config
  const dispatch = createEventDispatcher();

  
  interface Props {
    // props
    userRole: string;
    visitor: Visitor;
  }

  let { userRole, visitor }: Props = $props();

  // model
  let fullName = $derived(visitor.firstName + " " + visitor.lastName);

  // styles
  const twGreenStatus = "bg-green-200 text-green-500";
  const twRedStatus = "bg-rose-200 text-rose-500";
  let twRelationColors = $derived(visitor.relationship === "fam/fri" ? twGreenStatus : twRedStatus);
  let relationText = $derived(visitor.relationship === "fam/fri" ? "Friend" : "Contractor");
</script>

<Row>
  {#snippet cells()}
  
      <div class="text-xs text-zinc-800 basis-32">{fullName}</div>
      <div class="text-xs text-zinc-800 basis-20">{visitor.residentID}</div>
      <div class="hidden md:inline md:basis-20 md:flex md:flex-row">
        <span class="text-xs basis-16 {twRelationColors} text-center rounded-lg py-0.5">
          {relationText}
        </span>
      </div>
    
  {/snippet}
  {#snippet header()}
  
      <div class="text-xs font-bold">{fullName}</div>
      <div class="text-xs text-gray-500">
        {monthDayYearDate(visitor.accessStart)} - {monthDayYearDate(visitor.accessEnd)}
      </div>
    
  {/snippet}
  <!-- @migration-task: migrate this slot by hand, `bottom-content` is an invalid identifier -->
  <div slot="bottom-content" class="flex flex-row justify-around">
    {#if userRole === "resident"}
      <button
        class="basis-20 border border-rose-500 rounded-md text-center text-rose-500"
        onclick={() => dispatch("clickDelete", visitor)}
      >
        Delete
      </button>
    {/if}
  </div>
</Row>
