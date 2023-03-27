<script lang="ts">
  import type { Permit } from "$lib/models";
  import { Request } from "$lib/api";
  import { getLatestToken } from "$lib/auth";
  import { isOk } from "$lib/functional";

  // props
  export let permit: Permit;

  // model
  let errMsg = "";

  // events
  async function handleSubmit() {
    const editRes = await new Request()
      .setAccessToken(await getLatestToken())
      .put(`api/permit/${permit.id}`, permit);
    if (!isOk(editRes)) {
      errMsg = editRes.message;
      return;
    }

    alert(`Edited permit ${permit.id}`);
  }
</script>

<form
  class="bg-white rounded flex flex-col mx-auto w-52 md:w-64 gap-4 px-2 py-1"
  on:submit|preventDefault={handleSubmit}
>
  <p class="text-center font-bold text-lg">Edit Permit</p>
  {#if errMsg != ""}
    <div class="min-w-full bg-rose-200 rounded-md border border-rose-500 p-2">
      <p class="text-sm">{errMsg}</p>
    </div>
  {/if}
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
