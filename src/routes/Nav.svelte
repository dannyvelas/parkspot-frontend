<script lang="ts">
  import { dashboard } from "$lib/navigation";
  import { messageDecoder } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { post } from "$lib/api";
  import { getStores } from "$app/stores";
  import { goto } from "$app/navigation";
  import type { User } from "$lib/models";
  const { page } = getStores();

  export let user: User | undefined;

  // events
  async function logout() {
    if (user) {
      const postRes = await post(`api/logout`, {}, messageDecoder);
      if (!isOk(postRes)) {
        console.error("Error logging out");
      }

      user = undefined;
      goto("/login");
    }
  }
</script>

<nav>
  <ul>
    <li>
      {#if user}
        <button on:click={logout}>Logout</button>
      {:else}
        <a href="/">Home</a>
      {/if}
    </li>
    <li>
      {#if user}
        {#if $page.url.pathname !== "/admin" && $page.url.pathname !== "/resident"}
          <a href={dashboard(user)}>Go Back To Dashboard</a>
        {/if}
      {:else}
        <a href="/login" class:active={$page.url.pathname === "/login"}>Login</a>
      {/if}
    </li>
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
