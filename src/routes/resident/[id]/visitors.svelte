<script context="module" lang="ts">
  import { DEFAULT_AMT_PER_PAGE } from "$lib/constants";
  import { visitorDecoder } from "$lib/models";
  import { isOk } from "$lib/functional";
  import loadList from "$lib/loadList";

  const limit = DEFAULT_AMT_PER_PAGE;

  export const load = loadList("api/me/visitors", visitorDecoder, limit, false, "resident");
</script>

<script lang="ts">
  import type { Result } from "$lib/functional";
  import type { Visitor, ListWithMetadata } from "$lib/models";
  import { onMount } from "svelte";
  import VisitorList from "$lib/_VisitorList.svelte";

  // props
  export let result: Result<ListWithMetadata<Visitor>>;

  // helpers
  const dateToday = (() => {
    const tempDate = new Date();
    tempDate.setHours(0, 0, 0, 0);
    return tempDate;
  })();
  const dateTomorrow = (() => {
    const tempDate = new Date();
    tempDate.setDate(tempDate.getDate() + 1);
    tempDate.setHours(0, 0, 0, 0);
    return tempDate;
  })();

  // model
  const fields = {
    firstName: "",
    lastName: "",
    relationship: "fam/fri",
    startDate: dateToday.toISOString(),
    endDate: dateTomorrow.toISOString(),
  };
  let isForever = false;

  // init
  onMount(async () => {
    const { Litepicker } = await import("litepicker");
    const litepicker = new Litepicker({
      element: document.getElementById("litepicker") as HTMLElement,
      minDays: 2,
      minDate: Date.now(),
      singleMode: false,
      format: "MM-DD-YYYY",
    });
    litepicker.setStartDate(dateToday);
    litepicker.setEndDate(dateTomorrow);

    litepicker.on(
      "selected",
      (
        date1: import("litepicker/dist/types/datetime").DateTime,
        date2: import("litepicker/dist/types/datetime").DateTime
      ) => {
        fields.startDate = date1.toJSDate().toISOString();
        fields.endDate = date2.toJSDate().toISOString();
      }
    );
  });

  // events
  $: {
    if (fields.relationship === "contractor") {
      isForever = false;
    }
  }
</script>

<h1>My Visitor List</h1>
<h2>Add a Visitor</h2>
<form>
  <input required type="text" placeholder="Visitor First Name" />
  <input required type="text" placeholder="Visitor Last Name" />
  <select bind:value={fields.relationship}>
    <option value="fam/fri">Family Or Friend</option>
    <option value="contractor">Contractor</option>
  </select>
  {#if fields.relationship !== "contractor"}
    <div style="margin:20px;">
      <label for="isForever">Forever:</label>
      <input type="checkbox" id="isForever" bind:checked={isForever} />
    </div>
  {/if}
  <input required type="text" id="litepicker" style={isForever ? "display:none" : ""} />
  <input type="submit" value="Create" />
</form>
<hr />
{#if !isOk(result)}
  {result.message}
{:else}
  <div class="stack-container">
    <VisitorList visitors={result.data.records} totalAmount={result.data.metadata.totalAmount} />
  </div>
{/if}

<style>
  form {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  input {
    padding: 12px 20px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .stack-container {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1,
  h2 {
    text-align: center;
  }
</style>
