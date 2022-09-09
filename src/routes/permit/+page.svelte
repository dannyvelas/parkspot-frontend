<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { submitWithToken } from "$lib/form";

  // props
  export let data: PageData;
  export let form: Record<string, any> | undefined;

  // helpers
  const dateToday = (() => {
    const tempDate = new Date();
    tempDate.setHours(0, 0, 0, 0);
    return tempDate;
  })();
  const dateTomorrow = (() => {
    const tempDate = new Date();
    tempDate.setDate(tempDate.getDate() + 1);
    tempDate.setHours(23, 59, 59, 0);
    return tempDate;
  })();

  // model
  const residentId = data.session.user.role === "resident" ? data.session.user.id : "";
  let isException = false;
  $: exceptionReason = isException ? "" : ""; // clear when checked/unchecked
  let startDate = dateToday.toISOString();
  let endDate = dateTomorrow.toISOString();

  // init
  onMount(async () => {
    const { Litepicker } = await import("litepicker");
    const litepicker = new Litepicker({
      element: document.getElementById("litepicker") as HTMLElement,
      minDays: 2,
      minDate: dateToday,
      singleMode: false,
      format: "MM-DD-YYYY",
    });
    litepicker.setStartDate(dateToday);
    litepicker.setEndDate(dateTomorrow);

    litepicker.on("selected", (date1, date2) => {
      startDate = date1.toJSDate().toISOString();
      // make permit valid for the entirety of date2
      date2.setHours(23, 59, 59);
      endDate = date2.toJSDate().toISOString();
    });
  });

  // events
  async function handleSubmit() {
    const formData = new FormData(this);
    formData.set("startDate", startDate);
    formData.set("endDate", endDate);
    submitWithToken(formData, this.action, data.session.accessToken);
  }
</script>

<svelte:head>
  <title>New Permit</title>
</svelte:head>

{#if form?.error}
  <div style="text-align: center">
    <p>{form.error}</p>
  </div>
{/if}
<form method="POST" on:submit|preventDefault={handleSubmit}>
  <input
    required
    type="text"
    name="residentID"
    placeholder="Resident ID"
    readonly={residentId !== ""}
    value={residentId}
  />
  <input required type="text" name="licensePlate" placeholder="License Plate" />
  <input required type="text" name="color" placeholder="Color" />
  <input required type="text" name="make" placeholder="Make" />
  <input required type="text" name="model" placeholder="Model" />
  <input required type="text" name="dates" id="litepicker" />
  {#if data.session.user.role === "admin"}
    <div style="margin:20px;">
      <label for="isException">Exception: </label>
      <input
        type="checkbox"
        name="isException"
        id="isException"
        value="true"
        bind:checked={isException}
      />
    </div>
    {#if isException}
      <textarea
        name="exceptionReason"
        placeholder="Reason for exception"
        rows="5"
        cols="30"
        bind:value={exceptionReason}
      />
    {/if}
  {/if}
  <button type="submit" style="margin:10px;">Submit</button>
</form>

<style>
  form {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input[type="text"] {
    padding: 12px 20px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
