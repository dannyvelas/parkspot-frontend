<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "../app.css";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="mb-6">
  <Nav session={data.session} />
</div>

<div class="flex flex-row">
  {#if data.session}
    <Sidebar />
  {/if}

  <main class="px-10 mx-auto">
    <slot />
  </main>
</div>
