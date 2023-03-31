<script lang="ts">
  import type { PageData } from "./$types";
  import Nav from "$lib/components/Nav.svelte";
  import Sidebar, { openSidebar } from "$lib/components/Sidebar.svelte";
  import "../app.css";

  // props
  export let data: PageData;
</script>

<Sidebar />

<Nav on:openSidebar={() => openSidebar()} session={data.session} />

<main class="px-4 md:px-10">
  <slot />
</main>
