<script lang="ts">
  import type { User, Car } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { permitDecoder, listWithMetadataDecoder, carDecoder, residentDecoder } from "$lib/models";
  import { getStartOfToday, getEndOfTomorrow } from "$lib/time";
  import { createEventDispatcher } from "svelte";
  import Banner from "$lib/components/Banner.svelte";
  import Litepicker from "$lib/components/Litepicker.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let user: User;

  // model
  let bannerCfg = { isError: false, msg: "" };
  let carSelection = "";
  let residentCars: Car[] = [];
  let isException = false;
  const startOfToday = getStartOfToday();
  const endOfTomorrow = getEndOfTomorrow();

  const permitReq = {
    residentID: user.role === "resident" ? user.id : "",
    carID: "",
    licensePlate: "",
    color: "",
    make: "",
    model: "",
    startDate: startOfToday.toISOString(),
    endDate: endOfTomorrow.toISOString(),
    exceptionReason: "",
  };

  // events
  async function handleSubmit() {
    const result = await new Request(permitDecoder)
      .setAccessToken(await getLatestToken())
      .post("api/permit", permitReq);
    if (!isOk(result)) {
      bannerCfg = { isError: true, msg: result.message };
      return;
    }

    dispatch("permitCreated", result.data);
  }

  function updateDates(event: CustomEvent<{ date1: any; date2: any }>) {
    permitReq.startDate = event.detail.date1.toJSDate().toISOString();

    // make permit valid for the entirety of date2
    event.detail.date2.setHours(23, 59, 59);
    permitReq.endDate = event.detail.date2.toJSDate().toISOString();
  }

  async function downloadResidentCars() {
    const residentRes = await new Request(residentDecoder)
      .setAccessToken(await getLatestToken())
      .get(`api/resident/${permitReq.residentID}`);
    if (!isOk(residentRes)) {
      bannerCfg = { isError: true, msg: residentRes.message };
      return;
    }

    const carRes = await new Request(listWithMetadataDecoder(carDecoder))
      .setAccessToken(await getLatestToken())
      .get(`api/resident/${residentRes.data.id}/cars`);
    if (!isOk(carRes)) {
      bannerCfg = { isError: true, msg: carRes.message };
      return;
    }

    bannerCfg.msg = "";
    residentCars = carRes.data.records;
  }

  function setCarID(event: Event) {
    const el = event.target as HTMLSelectElement;
    if (el.value === "newCar") {
    }
  }
</script>

<form
  class="bg-white flex flex-col mx-auto w-52 md:w-64 gap-4"
  on:submit|preventDefault={handleSubmit}
>
  <Banner banner={bannerCfg} />
  <p class="text-center font-bold text-lg">Create Permit</p>
  <input
    required
    class="border rounded p-2"
    placeholder="Enter Resident ID"
    bind:value={permitReq.residentID}
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
    <input class="border rounded p-2" placeholder="Enter new color" bind:value={permitReq.color} />
    <input class="border rounded p-2" placeholder="Enter new make" bind:value={permitReq.make} />
    <input class="border rounded p-2" placeholder="Enter new model" bind:value={permitReq.model} />
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
        placeholder="Reason for exception"
        bind:value={permitReq.exceptionReason}
      />
    {/if}
  {/if}
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Create Permit
  </button>
</form>
