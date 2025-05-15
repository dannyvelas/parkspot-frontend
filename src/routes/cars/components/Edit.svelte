<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import type { Car } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth/jwt";
  import { isOk } from "$lib/functional";
  import { carDecoder } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner } from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  
  interface Props {
    // props
    item: Car;
  }

  let { item = $bindable() }: Props = $props();

  // events
  async function handleSubmit() {
    const editRes = await new Request(carDecoder)
      .setAccessToken(await getLatestToken())
      .put(`api/car`, item);
    if (!isOk(editRes)) {
      updateBanner(true, editRes.message);
      return;
    }

    item = editRes.data;
    updateBanner(false, "Car updated");

    dispatch("updated");
  }
</script>

<form
  class="bg-white flex flex-col mx-auto w-52 md:w-64 gap-4"
  onsubmit={preventDefault(handleSubmit)}
>
  <Banner />
  <p class="text-center font-bold text-lg">Edit Car</p>
  <input
    class="border rounded p-2"
    placeholder="Enter new license plate"
    bind:value={item.licensePlate}
  />
  <input class="border rounded p-2" placeholder="Enter new color" bind:value={item.color} />
  <input class="border rounded p-2" placeholder="Enter new make" bind:value={item.make} />
  <input class="border rounded p-2" placeholder="Enter new model" bind:value={item.model} />
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Edit Car
  </button>
</form>
