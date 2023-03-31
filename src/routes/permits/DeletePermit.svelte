<script lang="ts">
  import type { Permit } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner } from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let permit: Permit;

  // events
  async function handleSubmit() {
    const delRes = await new Request()
      .setAccessToken(await getLatestToken())
      .delete(`api/permit/${permit.id}`);
    if (!isOk(delRes)) {
      updateBanner(true, delRes.message);
      return;
    }

    dispatch("permitDeleted", permit);
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
      <td class="font-bold">ID</td><td>{permit.id}</td>
    </tr>
    <tr>
      <td class="font-bold">Resident ID</td><td>{permit.residentID}</td>
    </tr>
    <tr>
      <td class="font-bold">License Plate</td><td>{permit.licensePlate}</td>
    </tr>
    <tr>
      <td class="font-bold">Color</td><td>{permit.color}</td>
    </tr>
    <tr>
      <td class="font-bold">Make</td><td>{permit.make}</td>
    </tr>
    <tr>
      <td class="font-bold">Model</td><td>{permit.model}</td>
    </tr>
  </table>
  <button type="submit" class="bg-rose-400 text-white text-center border rounded px-4 py-1">
    Delete Permit
  </button>
</form>
