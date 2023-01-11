<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "normalize.css";
  import "../app.css";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Nav session={data.session} />
<div>
  <Sidebar />

  <main>
    <slot />
  </main>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
