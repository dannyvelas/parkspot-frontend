<script lang="ts">
  import { dashboard } from "$lib/navigation";
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
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
  <ul>
    {#if session}
      <li>
        <button on:click={logout}>Logout</button>
      </li>
      <li>
        {#if $page.url.pathname !== "/admin" && $page.url.pathname !== "/resident"}
          <a href={dashboard(session.user)}>Go Back To Dashboard</a>
        {/if}
      </li>
    {:else}
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/login" class:active={$page.url.pathname === "/login"}>Login</a>
      </li>
    {/if}
  </ul>
</nav>

<style>
  nav {
    border-radius: 5px;
  }

  ul {
    display: flex;
    list-style: none;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-inline-start: 0px;
  }

  li {
    margin: 10px;
  }

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
</style>
