<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "../app.css";
  import type { PageData } from "./$types";

  // props
  export let data: PageData;

  // model
  let sidebarIsOpen = false;
</script>

<div class="relative">
  {#if data.session && sidebarIsOpen}
    <Sidebar on:closeSidebar={() => (sidebarIsOpen = false)} />
  {/if}

  <div
    class="absolute w-full h-full {sidebarIsOpen ? 'block' : 'hidden'} z-10 bg-gray-800 opacity-25"
  />

  <Nav on:openSidebar={() => (sidebarIsOpen = true)} session={data.session} />

  <main class="grow px-4 md:px-10">
    <slot />
  </main>
</div>
