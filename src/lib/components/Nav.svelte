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
    <div class="cursor-default relative">
      <span class="hidden md:inline text-xs text-white">{session.user.firstName}</span>
      <iconify-icon
        icon="dashicons:arrow-down-alt2"
        on:click|preventDefault={() => (dropdownOpen = !dropdownOpen)}
        on:keypress={() => (dropdownOpen = !dropdownOpen)}
      />
      {#if dropdownOpen}
        <div class="absolute bg-stone-50 shadow z-0 right-0">
          <p class="dropdown-el" on:click={logout} on:keypress={logout}>Logout</p>
        </div>
      {/if}
    </div>
  {:else}
    <a href="/login" class:active={$page.url.pathname === "/login"}>Login</a>
  {/if}
</nav>

<style>
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

  .dropdown-el {
    font-size: 0.75rem;
    margin: 0.5rem 0.75rem;
  }
</style>
