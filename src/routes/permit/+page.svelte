<script lang="ts">
  import type { NewPermitReq } from "$lib/models";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { permitDecoder } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { goto } from "$app/navigation";
  import { post } from "$lib/api/send";

  // props
  export let data: PageData;
  const { residentId, user } = data;

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
  const fields: NewPermitReq = {
    residentId,
    car: {
      licensePlate: "",
      color: "",
      make: "",
      model: "",
    },
    startDate: dateToday.toISOString(),
    endDate: dateTomorrow.toISOString(),
    exceptionReason: "",
  };
  let bannerError = "";
  let isException = false;
  $: fields.exceptionReason = isException ? fields.exceptionReason : ""; // clear when unchecked

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

    litepicker.on(
      "selected",
      (
        date1: import("litepicker/dist/types/datetime").DateTime,
        date2: import("litepicker/dist/types/datetime").DateTime
      ) => {
        fields.startDate = date1.toJSDate().toISOString();

        // make permit valid for the entirety of date2
        date2.setHours(23, 59, 59);
        fields.endDate = date2.toJSDate().toISOString();
      }
    );
  });

  // events
  const submit = async () => {
    if (isException && fields.exceptionReason === "") {
      alert("If this permit is an exception, please put a reason for the exception");
      return;
    }

    fields.car.licensePlate = fields.car.licensePlate.toLocaleUpperCase();

    const result = await post("api/permit", fields, permitDecoder);
    if (!isOk(result)) {
      if (result.message.includes("400")) {
        alert(result.message);
      } else if (result.message.includes("401")) {
        alert("Your session has expired. Please log in again to create a permit.");
        goto("/login"); // logs out because layout.server.ts re-runs
      } else {
        bannerError = result.message;
      }
      return;
    }
    goto(`/permit/${result.data.id}`);
  };
</script>

<svelte:head>
  <title>New Permit</title>
</svelte:head>

{#if bannerError != ""}
  <div>
    <p>Error creating permit: {bannerError}. Please try again later.</p>
  </div>
{/if}
<form on:submit|preventDefault={submit}>
  <input
    required
    type="text"
    placeholder="Resident ID"
    readonly={residentId !== ""}
    bind:value={fields.residentId}
  />
  <input required type="text" placeholder="License Plate" bind:value={fields.car.licensePlate} />
  <input required type="text" placeholder="Color" bind:value={fields.car.color} />
  <input required type="text" placeholder="Make" bind:value={fields.car.make} />
  <input required type="text" placeholder="Model" bind:value={fields.car.model} />
  <input required type="text" id="litepicker" />
  {#if user.role === "admin"}
    <div style="margin:20px;">
      <label for="isException">Exception: </label>
      <input type="checkbox" id="isException" bind:checked={isException} />
    </div>
    {#if isException}
      <textarea
        bind:value={fields.exceptionReason}
        placeholder="Reason for exception"
        rows="5"
        cols="30"
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
