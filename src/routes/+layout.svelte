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
    <Sidebar twClasses={"absolute z-20 h-screen"} on:closeSidebar={() => (sidebarIsOpen = false)} />
  {/if}

  <div
    class="absolute w-full h-screen {sidebarIsOpen
      ? 'block'
      : 'hidden'} z-10 bg-gray-800 opacity-25"
    on:click={() => (sidebarIsOpen = false)}
    on:keypress={() => (sidebarIsOpen = false)}
  />

  <Nav on:openSidebar={() => (sidebarIsOpen = true)} session={data.session} />

  <main class="px-4 md:px-10">
    <slot />
  </main>
</div>
