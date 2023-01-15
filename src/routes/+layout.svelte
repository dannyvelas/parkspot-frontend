<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "normalize.css";
  import "../app.css";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div id="nav-container">
  <Nav session={data.session} />
</div>

<div id="app-container">
  {#if data.session}
    <div id="sidebar-container">
      <Sidebar />
    </div>
  {/if}

  <main>
    <slot />
  </main>
</div>

<style>
  #app-container {
    display: flex;
    flex-direction: row;
  }

  #nav-container {
    margin-bottom: 25px;
  }

  main {
    padding: 0 25px;
    margin: 0 auto;
  }
</style>
