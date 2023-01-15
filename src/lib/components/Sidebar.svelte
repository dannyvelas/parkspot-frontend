<script>
  import { page } from "$app/stores";

  let shrunk = false;
  $: dynamicPadding = !shrunk ? "60px" : "25px";
</script>

<nav>
  <button on:click={() => (shrunk = !shrunk)}>
    <iconify-icon icon="uiw:shrink" style="color:#6d6d6d" width="15" height="15" />
  </button>
  <div
    class="sidebar-wrapper"
    class:active={$page.url.pathname == "/dashboard"}
    style:padding-right={dynamicPadding}
  >
    <a href="/dashboard" class="sidebar-link" class:active={$page.url.pathname == "/dashboard"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/dashboard"}
        icon="material-symbols:dashboard-outline-rounded"
      />
      {#if !shrunk}
        Dashboard
      {/if}
    </a>
  </div>
  <div
    class="sidebar-wrapper"
    class:active={$page.url.pathname == "/permits"}
    style:padding-right={dynamicPadding}
  >
    <a href="/permits" class="sidebar-link" class:active={$page.url.pathname == "/permits"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/permits"}
        icon="clarity:details-line"
      />
      {#if !shrunk}
        Permits
      {/if}
    </a>
  </div>
  <div
    class="sidebar-wrapper"
    class:active={$page.url.pathname == "/residents"}
    style:padding-right={dynamicPadding}
  >
    <a href="/residents" class="sidebar-link" class:active={$page.url.pathname == "/residents"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/residents"}
        icon="uit:house-user"
      />
      {#if !shrunk}
        Residents
      {/if}
    </a>
  </div>
  <div
    class="sidebar-wrapper"
    class:active={$page.url.pathname == "/visitors"}
    style:padding-right={dynamicPadding}
  >
    <a href="/visitors" class="sidebar-link" class:active={$page.url.pathname == "/visitors"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/visitors"}
        icon="material-symbols:badge-outline"
      />
      {#if !shrunk}
        Visitors
      {/if}
    </a>
  </div>
</nav>

<style>
  nav {
    background-color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.06);
    border-radius: 0px 18px 18px 0px;
    margin-bottom: 25px;
    padding-top: 10px;
    padding-left: 25px;
  }

  button {
    border-style: none;
    background: none;
  }

  iconify-icon {
    display: inline;
  }

  a {
    text-decoration: none;
    color: #6d6d6d;
  }

  .sidebar-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    font-size: 0.75rem;
  }

  .sidebar-wrapper {
    padding-top: 12.5px;
    padding-bottom: 12.5px;
    margin-top: 12.5px;
    margin-bottom: 12.5px;
  }

  .circle {
    background-color: #f0f0f0;
    border-radius: 50px;
    padding: 10px;
    color: #8a8a8a;
  }

  .sidebar-wrapper.active {
    border-right: solid #13d380;
  }

  iconify-icon.active {
    background-color: #13d380;
    color: white;
  }

  a.active {
    color: #13d380;
  }
</style>
