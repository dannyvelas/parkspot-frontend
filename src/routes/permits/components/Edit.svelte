<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import type { Permit } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth/jwt";
  import { isOk } from "$lib/functional";
  import { permitDecoder } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Banner, { updateBanner } from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  
  interface Props {
    // props
    item: Permit;
  }

  let { item = $bindable() }: Props = $props();

  // events
  async function handleSubmit() {
    const editRes = await new Request(permitDecoder)
      .setAccessToken(await getLatestToken())
      .put(`api/permit`, item);
    if (!isOk(editRes)) {
      updateBanner(true, editRes.message);
      return;
    }

    item = editRes.data;
    updateBanner(false, "Permit updated");

    dispatch("updated");
  }
</script>

<form
  class="bg-white flex flex-col mx-auto w-52 md:w-64 gap-4"
  onsubmit={preventDefault(handleSubmit)}
>
  <Banner />
  <p class="text-center font-bold text-lg">Edit Permit</p>
  <input class="text-gray-500 border rounded p-2" bind:value={item.id} readonly />
  <input class="text-gray-500 border rounded p-2" bind:value={item.residentID} readonly />
  <input
    class="border rounded p-2"
    placeholder="Enter new license plate"
    bind:value={item.licensePlate}
  />
  <input class="border rounded p-2" placeholder="Enter new color" bind:value={item.color} />
  <input class="border rounded p-2" placeholder="Enter new make" bind:value={item.make} />
  <input class="border rounded p-2" placeholder="Enter new model" bind:value={item.model} />
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Edit Permit
  </button>
</form>
