<script lang="ts">
  import type { Resident } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner } from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let item: Resident;

  // events
  async function handleSubmit() {
    const delRes = await new Request()
      .setAccessToken(await getLatestToken())
      .delete(`api/resident/${item.id}`);
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
  <p class="text-center">Delete the following resident?</p>
  <table>
    <tr>
      <td class="font-bold">ID</td><td>{item.id}</td>
    </tr>
    <tr>
      <td class="font-bold">First</td><td>{item.firstName}</td>
    </tr>
    <tr>
      <td class="font-bold">Last</td><td>{item.lastName}</td>
    </tr>
    <tr>
      <td class="font-bold">Phone</td><td>{item.phone}</td>
    </tr>
    <tr>
      <td class="font-bold">Email</td><td>{item.email}</td>
    </tr>
  </table>
  <button type="submit" class="bg-rose-400 text-white text-center border rounded px-4 py-1">
    Delete Resident
  </button>
</form>
