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
    document.body.style.overflow = "";

    sidebarIsOpen = false;
  }

  function openSidebar() {
    //this prevents scrolling of the main window on larger screens
    document.body.style.overflow = "hidden";

    sidebarIsOpen = true;
  }
</script>

<div class="relative">
  {#if data.session && sidebarIsOpen}
    <Sidebar twClasses={"absolute z-20 min-h-full"} on:closeSidebar={closeSidebar} />
  {/if}

  <div
    class="fixed {sidebarIsOpen ? 'visible' : 'invisible'} z-10 inset-0 bg-gray-800 opacity-25"
    on:click={closeSidebar}
    on:keypress={closeSidebar}
  />

  <Nav on:openSidebar={openSidebar} session={data.session} />

  <main class="px-4 md:px-10">
    <slot />
  </main>
</div>
