<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import type { User } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth/jwt";
  import { isOk } from "$lib/functional";
  import { carDecoder } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner, clearBanner } from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  
  interface Props {
    // props
    user: User;
  }

  let { user }: Props = $props();

  // model
  let residentID = $state(user.role === "resident" ? user.id : "");

  // events
  async function handleSubmit() {
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());
    const result = await new Request(carDecoder)
      .setAccessToken(await getLatestToken())
      .post("api/car", formObject);
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
  onsubmit={preventDefault(handleSubmit)}
>
  <Banner />
  <p class="text-center font-bold text-lg">Create Car</p>
  {#if user.role !== "resident"}
    <input
      required
      class="border rounded p-2"
      name="residentID"
      placeholder="Enter Resident ID"
      bind:value={residentID}
    />
  {/if}
  <input
    required
    class="border rounded p-2"
    name="licensePlate"
    placeholder="Enter License Plate"
  />
  <input required class="border rounded p-2" name="color" placeholder="Enter Color" />
  <input required class="border rounded p-2" name="make" placeholder="Enter Make" />
  <input required class="border rounded p-2" name="model" placeholder="Enter Model" />
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Create Car
  </button>
</form>
