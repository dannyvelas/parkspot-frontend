<script lang="ts">
  import type { Permit } from "$lib/models";

  export let permit: Permit;
</script>

<div class="bg-white rounded flex flex-col mx-auto w-64 gap-4 px-2 py-1">
  <p class="text-center font-bold text-lg">Edit Permit</p>
  <input class="text-gray-500 border rounded p-2" value={permit.id} readonly />
  <input class="text-gray-500 border rounded p-2" value={permit.residentID} readonly />
  <input class="border rounded p-2" placeholder="Enter new color" value={permit.color} />
  <input class="border rounded p-2" placeholder="Enter new make" value={permit.make} />
  <input class="border rounded p-2" placeholder="Enter new model" value={permit.model} />
  <button class="bg-green-400 text-white border rounded px-4 py-1">Edit Permit</button>
</div>
