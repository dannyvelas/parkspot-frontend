<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";
  import { dashboard } from "$lib/navigation";

  export const load: Load = async ({ session }) => {
    if (session.user) {
      return { status: 302, redirect: dashboard(session.user) };
    }

    return {};
  };
</script>

<script lang="ts">
  import { userDecoder } from "$lib/models";
  import { isOk } from "$lib/functional";
  import { getStores } from "$app/stores";
  import { post } from "$lib/api";
  const { session } = getStores();

  // model
  let id = "";
  let password = "";
  let error = "";
  let passwordsShown = false;
  $: passwordType = passwordsShown ? "text" : "password";

  // events
  const inputPassword = (e: any) => {
    password = e.target.value;
  };

  const submit = async () => {
    const result = await post("api/login", { id, password }, userDecoder);
    if (!isOk(result)) {
      if (result.message.includes("Unauthorized")) {
        error = "Wrong username or password. Please try again.";
      } else if (result.message.includes("Failed to fetch")) {
        error = "Couldn't connect to server. Please notify the administration or try again later.";
      } else if (result.message.includes("500")) {
        error = "Server error. Please notify the administration or try again later.";
      }
      return;
    }

    $session.user = result.data;
  };
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>
{#if error}
  <div style="text-align: center">
    <p>{error}</p>
  </div>
{/if}
<form on:submit|preventDefault={submit}>
  <input required type="username" placeholder="Username" bind:value={id} />
  <input required type={passwordType} placeholder="Password" on:input={inputPassword} />
  <div style="margin:20px;">
    <label for="showPasswords">Show Passwords: </label>
    <input type="checkbox" id="showPasswords" bind:checked={passwordsShown} />
  </div>
  <button type="submit">Sign in</button>
</form>
<div style="text-align: center; margin:20px">
  <a href="/forgot-password">Forgot your Password?</a>
</div>

<style>
  form {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    padding: 12px 20px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
