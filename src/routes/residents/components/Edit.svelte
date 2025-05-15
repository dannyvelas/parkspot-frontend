<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import type { Resident } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth/jwt";
  import { isOk } from "$lib/functional";
  import { residentDecoder } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner } from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  
  interface Props {
    // props
    item: Resident;
  }

  let { item = $bindable() }: Props = $props();

  // events
  async function handleSubmit() {
    const editRes = await new Request(residentDecoder)
      .setAccessToken(await getLatestToken())
      .put(`api/resident`, item);
    if (!isOk(editRes)) {
      updateBanner(true, editRes.message);
      return;
    }

    item = editRes.data;
    updateBanner(false, "Resident updated");

    dispatch("updated");
  }
</script>

<form
  class="bg-white flex flex-col mx-auto w-52 md:w-64 gap-4"
  onsubmit={preventDefault(handleSubmit)}
>
  <Banner />
  <p class="text-center font-bold text-lg">Edit Resident</p>
  <input class="text-gray-500 border rounded p-2" bind:value={item.id} readonly />
  <input
    class="border rounded p-2"
    placeholder="Enter new first name"
    bind:value={item.firstName}
  />
  <input class="border rounded p-2" placeholder="Enter new last name" bind:value={item.lastName} />
  <input class="border rounded p-2" placeholder="Enter new phone" bind:value={item.phone} />
  <input class="border rounded p-2" placeholder="Enter new email" bind:value={item.email} />
  <input
    class="border rounded p-2"
    type="number"
    placeholder="Enter new amount of days used"
    bind:value={item.amtParkingDaysUsed}
  />
  <div class="text-center">
    <label for="unlimDays">Unlimited Days: </label>
    <input id="unlimDays" type="checkbox" bind:checked={item.unlimDays} />
  </div>
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Edit Resident
  </button>
</form>
