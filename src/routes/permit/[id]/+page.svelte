<script lang="ts">
  import type { PageData } from "./$types";
  import { isOk } from "$lib/functional";

  export let data: PageData;
</script>

<svelte:head>
  <title>Edit Permit</title>
</svelte:head>

{#if !isOk(data.permit)}
  <p>Error: {data.permit.message}</p>
{:else}
  <div class="bg-white rounded flex flex-col mx-auto w-64 gap-4 p-5">
    <p class="text-center font-bold text-lg">Edit Permit</p>
    <input class="text-gray-500 border rounded p-2" value={data.permit.data.id} readonly />
    <input class="text-gray-500 border rounded p-2" value={data.permit.data.residentID} readonly />
    <input
      class="border rounded p-2"
      placeholder="Enter new color"
      value={data.permit.data.color}
    />
    <input class="border rounded p-2" placeholder="Enter new make" value={data.permit.data.make} />
    <input
      class="border rounded p-2"
      placeholder="Enter new model"
      value={data.permit.data.model}
    />
    <button class="bg-green-400 text-white border rounded px-4 py-1">Edit Permit</button>
  </div>
{/if}
