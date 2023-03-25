<script lang="ts">
  import type { PageData } from "./$types";
  import Nav from "$lib/components/Nav.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "../app.css";

  // props
  export let data: PageData;

  // model
  let sidebarIsOpen = false;

  // events
  function closeSidebar() {
    sidebarIsOpen = false;
  }

  function openSidebar() {
    sidebarIsOpen = true;
  }
</script>

<div class="relative">
  {#if data.session && sidebarIsOpen}
    <Sidebar twClasses={"absolute z-20 min-h-full"} on:closeSidebar={closeSidebar} />
  {/if}

  <div
    class="fixed w-full h-screen {sidebarIsOpen ? 'block' : 'hidden'} z-10 bg-gray-800 opacity-25"
    on:click={closeSidebar}
    on:keypress={closeSidebar}
  />

  <Nav on:openSidebar={openSidebar} session={data.session} />

  <main class="px-4 md:px-10">
    <slot />
  </main>
</div>
