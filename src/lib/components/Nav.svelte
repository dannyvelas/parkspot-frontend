<script lang="ts">
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { createEventDispatcher } from "svelte";
  import logo from "$lib/assets/logo.png";
  import type { Session } from "$lib/auth";

  // config
  const dispatch = createEventDispatcher();

  
  interface Props {
    // props
    session: Session | undefined;
  }

  let { session }: Props = $props();

  // model
  let dropdownOpen = $state(false);

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
      <button onclick={() => dispatch("openSidebar")}>
        <iconify-icon class="text-white inline-block align-middle" icon="charm:menu-hamburger"></iconify-icon>
      </button>
    {/if}
    <a href="/"><img class="h-auto w-28" alt="ParkSpot Logo" src={logo} /></a>
  </div>
  {#if session}
    <button class="cursor-default relative" onclick={() => (dropdownOpen = !dropdownOpen)}>
      <span class="hidden md:inline text-xs text-white">{session.user.firstName}</span>
      <iconify-icon class="text-white inline-block align-middle" icon="dashicons:arrow-down-alt2"></iconify-icon>
      {#if dropdownOpen}
        <div class="absolute bg-stone-50 shadow z-0 right-0">
          <p class="text-xs my-2 mx-3" onclick={logout} onkeypress={logout}>Logout</p>
        </div>
      {/if}
    </button>
  {:else}
    <a href="/login" class="text-white" class:active={$page.url.pathname === "/login"}>Login</a>
  {/if}
</nav>
