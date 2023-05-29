<script lang="ts">
  import type { User, Car } from "$lib/models";
  //import { onMount } from "svelte";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { listWithMetadataDecoder, carDecoder, residentDecoder, permitDecoder } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner, clearBanner } from "$lib/components/Banner.svelte";
  import Litepicker, { getStartDate, getEndDate } from "$lib/components/Litepicker.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let user: User;

  // model
  let carSelection = "";
  let isException = false;
  let residentCars: Car[] = [];
  let residentID = user.role === "resident" ? user.id : "";

  // init
  if (user.role === "resident") {
    seedResidentCars();
  }

  async function seedResidentCars() {
    const carRes = await new Request(listWithMetadataDecoder(carDecoder))
      .setAccessToken(await getLatestToken())
      .get(`api/resident/${residentID}/cars`);
    if (!isOk(carRes)) {
      updateBanner(true, carRes.message);
      return [];
    }

    clearBanner();
    residentCars = carRes.data.records;
  }

  // events
  async function handleSubmit() {
    const formData = new FormData(this);
    if (carSelection !== "newCar") {
      formData.set("carID", carSelection);
    }
    formData.set("startDate", getStartDate().toISOString());
    formData.set("endDate", getEndDate().toISOString());

    const formObject = Object.fromEntries(formData.entries());
    const result = await new Request(permitDecoder)
      .setAccessToken(await getLatestToken())
      .post("api/permit", formObject);
    if (!isOk(result)) {
      updateBanner(true, result.message);
      return;
    }

    clearBanner();
    dispatch("created", result.data);
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
      .get(`api/resident/${residentID}/cars`);
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
  on:submit|preventDefault={handleSubmit}
>
  <Banner />
  <p class="text-center font-bold text-lg">Create Permit</p>
  {#if user.role !== "resident"}
    <input
      required
      class="border rounded p-2"
      name="residentID"
      placeholder="Enter Resident ID"
      bind:value={residentID}
      readonly={user.role == "resident"}
      on:blur={downloadResidentCars}
    />
  {/if}
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
  <Litepicker />
  {#if user.role === "admin"}
    <div class="text-center">
      <label for="isException">Exception: </label>
      <input id="isException" type="checkbox" bind:checked={isException} />
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
