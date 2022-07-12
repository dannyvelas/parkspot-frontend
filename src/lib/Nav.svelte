<script lang="ts">
  import type { User } from "$lib/models";
  import { getStores } from "$app/stores";
  import { messageDecoder } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { post } from "$lib/api";
  const { session, page } = getStores();

  // helpers
  const dashboard = (user: User) => (user.role === "resident" ? `/resident` : "/admin");

  // events
  async function logout() {
    if ($session.user) {
      const postRes = await post(`api/logout`, {}, messageDecoder);
      if (!isOk(postRes)) {
        console.error("Error logging out");
      }
      $session.user = undefined;
    }
  }
</script>

<nav>
  <ul>
    <li><a href="/" on:click={logout}>Home</a></li>
    <li>
      {#if $session.user}
        {#if $page.url.pathname !== "/admin" && $page.url.pathname !== "/resident"}
          <a href={dashboard($session.user)}>Go Back To Dashboard</a>
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

  a {
    text-decoration: none;
    font-weight: bold;
    color: #636363;
  }
</style>
