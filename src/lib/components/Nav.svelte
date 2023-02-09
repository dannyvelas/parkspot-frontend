<script lang="ts">
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { createEventDispatcher } from "svelte";
  import logo from "$lib/assets/logo.png";
  import type { Session } from "$lib/auth";

  // config
  const dispatch = createEventDispatcher();

  // props
  export let session: Session | undefined;

  // model
  let dropdownOpen = false;

  // events
  async function logout() {
    if (session) {
      const postRes = await fetch("/logout", { method: "POST" });
      if (!postRes.ok) {
        console.error("Error logging out");
      }

      dropdownOpen = false;
      invalidateAll();
    }
  }
</script>

<nav class="mb-6 bg-green-400 flex flex-row justify-between items-center py-3.5 px-6">
  <div class="flex flex-row gap-x-4">
    {#if session}
      <button on:click={() => dispatch("openSidebar")}>
        <iconify-icon icon="charm:menu-hamburger" />
      </button>
    {/if}
    <a href="/"><img alt="ParkSpot Logo" src={logo} /></a>
  </div>
  {#if session}
    <div id="user-menu">
      <p id="user-name">{session.user.firstName + " " + session.user.lastName}</p>
      <iconify-icon
        icon="dashicons:arrow-down-alt2"
        on:click|preventDefault={() => (dropdownOpen = !dropdownOpen)}
        on:keypress={() => (dropdownOpen = !dropdownOpen)}
      />
      {#if dropdownOpen}
        <div id="dropdown">
          <p class="dropdown-el" on:click={logout} on:keypress={logout}>Logout</p>
        </div>
      {/if}
    </div>
  {:else}
    <a href="/login" class:active={$page.url.pathname === "/login"}>Login</a>
  {/if}
</nav>

<style>
  #user-menu {
    cursor: default;
    position: relative;
  }

  #user-name {
    display: inline-block;
    color: white;
    font-size: 0.75rem;
    margin: 0;
  }

  iconify-icon {
    color: white;
    display: inline-block;
    vertical-align: middle;
  }

  img {
    width: 140px;
    height: auto;
  }

  a {
    color: white;
    text-decoration: none;
    font-family: "Work Sans", sans-serif;
    font-weight: 300;
  }

  #dropdown {
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 0;
    width: 100%;
  }

  .dropdown-el {
    font-size: 0.75rem;
    margin: 0.5rem 0.75rem;
  }
</style>
