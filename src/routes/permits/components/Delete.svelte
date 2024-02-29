<script lang="ts">
  import type { Permit } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth/jwt";
  import { isOk } from "$lib/functional";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner } from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let item: Permit;

  // events
  async function handleSubmit() {
    const delRes = await new Request()
      .setAccessToken(await getLatestToken())
      .delete(`api/permit/${item.id}`);
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
  <p class="text-center">Delete the following permit?</p>
  <table>
    <tr>
      <td class="font-bold">ID</td><td>{item.id}</td>
    </tr>
    <tr>
      <td class="font-bold">Resident ID</td><td>{item.residentID}</td>
    </tr>
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
      <td class="font-bold">Model</td><td>{item.model}</td>
    </tr>
  </table>
  <button type="submit" class="bg-rose-400 text-white text-center border rounded px-4 py-1">
    Delete Permit
  </button>
</form>
