<script lang="ts">
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import logo from "$lib/assets/logo.png";
  import type { Session } from "$lib/auth";

  export let session: Session | undefined;
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

<nav class="mb-6">
  <a href="/"><img alt="ParkSpot Logo" src={logo} /></a>
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
  nav {
    background-color: #13d380;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 14px 35px;
  }

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
    z-index: 1;
    width: 100%;
  }

  .dropdown-el {
    font-size: 0.75rem;
    margin: 0.5rem 0.75rem;
  }
</style>
