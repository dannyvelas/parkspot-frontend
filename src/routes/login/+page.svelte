<script lang="ts">
  import { enhance } from "$app/forms";

  // props
  export let form: Record<string, any> | undefined;

  // model
  let passwordsShown = false;
  $: passwordType = passwordsShown ? "text" : "password";
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>
{#if form?.response}
  <div style="text-align: center">
    <p>{form.response}</p>
  </div>
{/if}
<form method="POST" use:enhance>
  <input required name="id" type="username" placeholder="Username" />
  {#if form?.missing && form.missing.includes("id")}
    <p>Please enter your ID</p>
  {/if}
  <input required name="password" type={passwordType} placeholder="Password" />
  {#if form?.missing && form.missing.includes("password")}
    <p>Please enter your password</p>
  {/if}
  <div style="margin:20px;">
    <label for="showPasswords">Show Passwords: </label>
    <input type="checkbox" id="showPasswords" bind:checked={passwordsShown} />
  </div>
  <button type="submit">Log in</button>
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
