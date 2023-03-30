<script lang="ts">
  import type { Permit } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";
  import { permitDecoder } from "$lib/models";
  import { createEventDispatcher } from "svelte";
  import Banner from "$lib/components/Banner.svelte";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let permit: Permit;

  // model
  let bannerCfg = { isError: false, msg: "" };

  // events
  async function handleSubmit() {
    const editRes = await new Request(permitDecoder)
      .setAccessToken(await getLatestToken())
      .put(`api/permit`, permit);
    if (!isOk(editRes)) {
      bannerCfg = { isError: true, msg: editRes.message };
      return;
    }

    permit = editRes.data;
    bannerCfg = { isError: false, msg: "Permit updated" };

    dispatch("permitUpdated", permit);
  }
</script>

<form
  class="bg-white rounded flex flex-col mx-auto w-52 md:w-64 gap-4 px-2 py-1"
  on:submit|preventDefault={handleSubmit}
>
  <Banner banner={bannerCfg} />
  <p class="text-center font-bold text-lg">Edit Permit</p>
  <input class="text-gray-500 border rounded p-2" bind:value={permit.id} readonly />
  <input class="text-gray-500 border rounded p-2" bind:value={permit.residentID} readonly />
  <input
    class="border rounded p-2"
    placeholder="Enter new license plate"
    bind:value={permit.licensePlate}
  />
  <input class="border rounded p-2" placeholder="Enter new color" bind:value={permit.color} />
  <input class="border rounded p-2" placeholder="Enter new make" bind:value={permit.make} />
  <input class="border rounded p-2" placeholder="Enter new model" bind:value={permit.model} />
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Edit Permit
  </button>
</form>
