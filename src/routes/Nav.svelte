<script lang="ts">
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import logo from "$lib/assets/logo.png";
  import type { Session } from "$lib/auth";

  export let session: Session | undefined;

  // events
  async function logout() {
    if (session) {
      const postRes = await fetch("/logout", { method: "POST" });
      if (!postRes.ok) {
        console.error("Error logging out");
      }

      invalidateAll();
    }
  }
</script>

<nav>
  <a href="/"><img alt="ParkSpot Logo" src={logo} /></a>
  {#if session}
    <div id="user-menu">
      <p id="user-name">{session.user.firstName + " " + session.user.lastName}</p>
      <iconify-icon icon="dashicons:arrow-down-alt2" style="color: white" />
    </div>
  {:else}
    <a href="/login" class:active={$page.url.pathname === "/login"}>Login</a>
  {/if}
</nav>

<style>
  nav {
    background-color: #13d380;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 14px 35px;
  }

  #user-menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 0.5rem;
  }

  #user-name {
    color: white;
    font-size: 0.75rem;
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
</style>
