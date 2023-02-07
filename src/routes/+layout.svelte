<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "../app.css";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Nav session={data.session} />

<div class="flex flex-row">
  {#if data.session}
    <Sidebar />
  {/if}

  <main class="grow px-10">
    <slot />
  </main>
</div>
