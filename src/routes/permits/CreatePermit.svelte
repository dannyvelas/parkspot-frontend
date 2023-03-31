<script lang="ts">
  import type { User, Car } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { listWithMetadataDecoder, carDecoder, residentDecoder } from "$lib/models";
  import { getStartOfToday, getEndOfTomorrow } from "$lib/time";
  import { submitWithToken } from "$lib/form";
  import Banner, { updateBanner, clearBanner } from "$lib/components/Banner.svelte";
  import Litepicker from "$lib/components/Litepicker.svelte";

  // config
  const startOfToday = getStartOfToday();
  const endOfTomorrow = getEndOfTomorrow();

  // props
  export let user: User;

  // model
  let carSelection = "";
  let residentCars: Car[] = [];
  let isException = false;

  // form fields
  let residentID = user.role === "resident" ? user.id : "";
  let startDate = startOfToday.toISOString();
  let endDate = endOfTomorrow.toISOString();

  // events
  async function handleSubmit() {
    const formData = new FormData(this);
    if (carSelection !== "newCar") {
      formData.set("carID", carSelection);
    }
    formData.set("startDate", startDate);
    formData.set("endDate", endDate);

    submitWithToken(this, { formData });
  }

  function updateDates(event: CustomEvent<{ date1: any; date2: any }>) {
    startDate = event.detail.date1.toJSDate().toISOString();

    // make permit valid for the entirety of date2
    event.detail.date2.setHours(23, 59, 59);
    endDate = event.detail.date2.toJSDate().toISOString();
  }

  async function downloadResidentCars() {
    if (!residentID) {
      return;
    }
    const residentRes = await new Request(residentDecoder)
      .setAccessToken(await getLatestToken())
      .get(`api/resident/${residentID}`);
    if (!isOk(residentRes)) {
      updateBanner(true, residentRes.message);
      return;
    }

    const carRes = await new Request(listWithMetadataDecoder(carDecoder))
      .setAccessToken(await getLatestToken())
      .get(`api/resident/${residentRes.data.id}/cars`);
    if (!isOk(carRes)) {
      updateBanner(true, carRes.message);
      return;
    }

    clearBanner();
    residentCars = carRes.data.records;
  }
</script>

<form
  class="bg-white flex flex-col mx-auto w-52 md:w-64 gap-4"
  method="POST"
  action="/permit"
  on:submit|preventDefault={handleSubmit}
>
  <Banner />
  <p class="text-center font-bold text-lg">Create Permit</p>
  <input
    required
    class="border rounded p-2"
    name="residentID"
    placeholder="Enter Resident ID"
    bind:value={residentID}
    readonly={user.role == "resident"}
    on:blur={downloadResidentCars}
  />
  <select class="border rounded p-2" bind:value={carSelection}>
    <option value="" disabled selected>Select Car</option>
    {#each residentCars as car}
      <option value={car.id}>{car.color} {car.make} {car.model}</option>
    {/each}
    <option value="newCar">Add a new car</option>
  </select>
  {#if carSelection === "newCar"}
    <input class="border rounded p-2" name="licensePlate" placeholder="Enter License Plate" />
    <input class="border rounded p-2" name="color" placeholder="Enter Color" />
    <input class="border rounded p-2" name="make" placeholder="Enter Make" />
    <input class="border rounded p-2" name="model" placeholder="Enter Model" />
  {/if}
  <Litepicker startDate={startOfToday} endDate={endOfTomorrow} on:selected={updateDates} />
  {#if user.role === "admin"}
    <div class="text-center">
      <label for="isException">Exception: </label>
      <input type="checkbox" bind:checked={isException} />
    </div>
    {#if isException}
      <textarea
        class="border rounded p-2 resize-none"
        name="exceptionReason"
        placeholder="Reason for exception"
      />
    {/if}
  {/if}
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Create Permit
  </button>
</form>
