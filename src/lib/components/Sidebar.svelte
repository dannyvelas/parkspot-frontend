<script lang="ts">
  import { page } from "$app/stores";
  import { cubicIn } from "svelte/easing";
  import { createEventDispatcher } from "svelte";

  // config
  const dispatch = createEventDispatcher();

  export function horizontalSlide(node: HTMLElement, { delay = 0 } = {}) {
    const style = getComputedStyle(node);
    return {
      delay,
      duration: 400,
      easing: cubicIn,
      css: (t: number) => `
        overflow: hidden;
        width: ${t * parseFloat(style.width)}px;
        padding-right: ${t * parseFloat(style.paddingRight)}px;`,
    };
  }
</script>

<nav transition:horizontalSlide class="absolute z-20 bg-white flex flex-col h-full">
  <button class="text-left" on:click={() => dispatch("closeSidebar")}>
    <iconify-icon icon="mingcute:close-line" style="color:#6d6d6d" width="15" height="15" />
  </button>
  <div class="sidebar-wrapper" class:active={$page.url.pathname == "/dashboard"}>
    <a href="/dashboard" class="sidebar-link" class:active={$page.url.pathname == "/dashboard"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/dashboard"}
        icon="material-symbols:dashboard-outline-rounded"
      />
      <span>Dashboard</span>
    </a>
  </div>
  <div class="sidebar-wrapper" class:active={$page.url.pathname == "/permits"}>
    <a href="/permits/all" class="sidebar-link" class:active={$page.url.pathname == "/permits"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname.startsWith("/permits")}
        icon="clarity:details-line"
      />
      <span>Permits</span>
    </a>
  </div>
  <div class="sidebar-wrapper" class:active={$page.url.pathname == "/residents"}>
    <a href="/residents" class="sidebar-link" class:active={$page.url.pathname == "/residents"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/residents"}
        icon="uit:house-user"
      />
      <span>Residents</span>
    </a>
  </div>
  <div class="sidebar-wrapper" class:active={$page.url.pathname == "/visitors"}>
    <a href="/visitors" class="sidebar-link" class:active={$page.url.pathname == "/visitors"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/visitors"}
        icon="material-symbols:badge-outline"
      />
      <span>Visitors</span>
    </a>
  </div>
</nav>

<style>
  nav {
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.06);
    border-radius: 0px 18px 18px 0px;
    margin-bottom: 25px;
    padding-top: 10px;
    padding-left: 25px;
  }

  a {
    text-decoration: none;
    color: #6d6d6d;
  }

  .sidebar-link {
    display: flex;
    flex-direction: row;
    align-items: center;
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
    margin: 0 10px;
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

  span {
    padding-right: 40px;
  }
</style>
