<script lang="ts">
  import type { Car } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth/jwt";
  import { isOk } from "$lib/functional";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner } from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let item: Car;

  // events
  async function handleSubmit() {
    const delRes = await new Request()
      .setAccessToken(await getLatestToken())
      .delete(`api/car/${item.id}`);
    if (!isOk(delRes)) {
      updateBanner(true, delRes.message);
      return;
    }

    dispatch("deleted", item);
  }
</script>

<form
  class="bg-white flex flex-col mx-auto w-52 md:w-64 gap-4"
  on:submit|preventDefault={handleSubmit}
>
  <Banner />
  <p class="text-center">Delete the following car?</p>
  <table>
    <tr>
      <td class="font-bold">License Plate</td><td>{item.licensePlate}</td>
    </tr>
    <tr>
      <td class="font-bold">Color</td><td>{item.color}</td>
    </tr>
    <tr>
      <td class="font-bold">Make</td><td>{item.make}</td>
    </tr>
    <tr>
      <td class="font-bold">model</td><td>{item.model}</td>
    </tr>
  </table>
  <button type="submit" class="bg-rose-400 text-white text-center border rounded px-4 py-1">
    Delete Car
  </button>
</form>
