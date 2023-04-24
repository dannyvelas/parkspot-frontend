<script lang="ts">
  import type { Visitor } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import { monthDayYearDate } from "$lib/time";
  import Row from "$lib/components/Row.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let userRole: string;
  export let visitor: Visitor;

  // model
  $: fullName = visitor.firstName + " " + visitor.lastName;

  // styles
  const twGreenStatus = "bg-green-200 text-green-500";
  const twRedStatus = "bg-rose-200 text-rose-500";
  $: twRelationColors = visitor.relationship === "fam/fri" ? twGreenStatus : twRedStatus;
  $: relationText = visitor.relationship === "fam/fri" ? "Friend" : "Contractor";
</script>

<Row>
  <svelte:fragment slot="cells">
    <div class="text-xs text-zinc-800 basis-32">{fullName}</div>
    <div class="text-xs text-zinc-800 basis-20">{visitor.residentID}</div>
    <div class="hidden md:inline md:basis-20 md:flex md:flex-row">
      <span class="text-xs basis-16 {twRelationColors} text-center rounded-lg py-0.5">
        {relationText}
      </span>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="header">
    <div class="text-xs font-bold">{fullName}</div>
    <div class="text-xs text-gray-500">
      {monthDayYearDate(visitor.accessStart)} - {monthDayYearDate(visitor.accessEnd)}
    </div>
  </svelte:fragment>
  <div slot="bottom-content" class="flex flex-row justify-around">
    {#if userRole === "resident"}
      <button
        class="basis-20 border border-rose-500 rounded-md text-center text-rose-500"
        on:click={() => dispatch("clickDelete", visitor)}
      >
        Delete
      </button>
    {/if}
  </div>
</Row>
