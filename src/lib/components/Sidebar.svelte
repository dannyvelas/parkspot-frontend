<script lang="ts">
  import { page } from "$app/stores";
  import { cubicIn } from "svelte/easing";

  let shrunk = false;
  $: icon = !shrunk ? "ic:round-arrow-back-ios-new" : "ic:round-arrow-forward-ios";

  export function horizontalSlide(node: HTMLElement, { delay = 0 } = {}) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    return {
      delay,
      duration: 400,
      easing: cubicIn,
      css: (t: number) => {
        console.log(t * parseFloat(style.paddingRight) + 25);
        return `
        overflow: hidden;
        opacity: ${Math.min(t * 20, 1) * opacity};
        width: ${t * parseFloat(style.width)}px;
        padding-right: ${t * parseFloat(style.paddingRight) + 25}px`;
      },
    };
  }
</script>

<nav>
  <button style:text-align="right" on:click={() => (shrunk = !shrunk)}>
    <iconify-icon {icon} style="color:#6d6d6d" width="15" height="15" />
  </button>
  <div class="sidebar-wrapper" class:active={$page.url.pathname == "/dashboard"}>
    <a href="/dashboard" class="sidebar-link" class:active={$page.url.pathname == "/dashboard"}>
      <iconify-icon
        class="circle"
        class:active={$page.url.pathname == "/dashboard"}
        icon="material-symbols:dashboard-outline-rounded"
      />
      {#if !shrunk}
        <span transition:horizontalSlide>Dashboard</span>
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
