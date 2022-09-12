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
  let relationship = "fam/fri";
  let isForever = false;
  $: if (relationship === "contractor") isForever = false;
  let accessStart = dateToday.toISOString();
  let accessEnd = dateTomorrow.toISOString();

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
      accessStart = date1.toJSDate().toISOString();
      // make permit valid for the entirety of date2
      date2.setHours(23, 59, 59);
      accessEnd = date2.toJSDate().toISOString();
    });
  });

  // events
  function handleSubmit() {
    const formData = new FormData(this);
    formData.set("accessStart", accessStart);
    formData.set("accessEnd", accessEnd);
    submitWithToken(this, data.session.accessToken, { formData, resetForm: false });
  }
  $: if (form?.response) {
    alert(form.response);
  }
</script>

<h2>Add a Visitor</h2>
<form on:submit|preventDefault={handleSubmit}>
  <input required type="text" name="firstName" placeholder="Visitor First Name" />
  <input required type="text" name="lastName" placeholder="Visitor Last Name" />
  <select name="relationship" bind:value={relationship}>
    <option value="fam/fri">Family Or Friend</option>
    <option value="contractor">Contractor</option>
  </select>
  {#if relationship !== "contractor"}
    <div style="margin:20px;">
      <label for="isForever">Forever:</label>
      <input
        type="checkbox"
        name="isForever"
        id="isForever"
        value="true"
        bind:checked={isForever}
      />
    </div>
  {/if}
  <input type="text" id="litepicker" style={isForever ? "display:none" : ""} />
  <button type="submit">Create</button>
</form>

<style>
  h2 {
    text-align: center;
  }

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
