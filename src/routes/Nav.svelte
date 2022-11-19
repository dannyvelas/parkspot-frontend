<script lang="ts">
  import { dashboard } from "$lib/navigation";
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
  <a href="/"><img id="logo" alt="ParkSpot Logo" src={logo} /></a>
  {#if session}
    <button>Placeholder</button>
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

  /*
  a,
  button {
    text-decoration: none;
    font-weight: bold;
    background-color: transparent;
    border: none;
  }

  a {
    color: #636363;
  }

  button {
    color: #ff2d00;
  }
   */
</style>
