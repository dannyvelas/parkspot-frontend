<script lang="ts">
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { visitorDecoder } from "$lib/models";
  import { getEndOfTime } from "$lib/time";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner, clearBanner } from "$lib/components/Banner.svelte";
  import Litepicker, { getStartDate, getEndDate } from "$lib/components/Litepicker.svelte";

  // config
  const dispatch = createEventDispatcher();

  // model
  let relationship = "fam/fri";
  let isForever = false;
  $: if (relationship === "contractor") isForever = false;

  // events
  async function handleSubmit() {
    const formData = new FormData(this);
    formData.set("accessStart", getStartDate().toISOString());
    const endDate = isForever ? getEndOfTime() : getEndDate();
    formData.set("accessEnd", endDate.toISOString());

    const formObject = Object.fromEntries(formData.entries());
    const result = await new Request(visitorDecoder)
      .setAccessToken(await getLatestToken())
      .post("api/visitor", formObject);
    if (!isOk(result)) {
      updateBanner(true, result.message);
      return;
    }

    clearBanner();
    dispatch("created", result.data);
  }
</script>

<form
  class="bg-white flex flex-col mx-auto w-52 md:w-64 gap-4"
  on:submit|preventDefault={handleSubmit}
>
  <Banner />
  <p class="text-center font-bold text-lg">Create Visitor</p>
  <input required class="border rounded p-2" name="firstName" placeholder="Enter First Name" />
  <input required class="border rounded p-2" name="lastName" placeholder="Enter Last Name" />
  <select class="border rounded p-2" name="relationship" bind:value={relationship}>
    <option value="fam/fri">Friend</option>
    <option value="contractor">Contractor</option>
  </select>
  {#if relationship !== "contractor"}
    <div class="text-center">
      <label for="isForever">Forever:</label>
      <input type="checkbox" name="isForever" id="isForever" bind:checked={isForever} />
    </div>
  {/if}
  {#if !isForever}
    <Litepicker />
  {/if}
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Create Visitor
  </button>
</form>
