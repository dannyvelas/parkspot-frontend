<script lang="ts">
  import { submitWithToken } from "$lib/form";
  import { tokenStore } from "$lib/auth";
  import type { PageData } from "./$types";

  // props
  export let data: PageData;
  export let form: Record<string, any> | undefined;

  // model
  let passwordsShown = false;
  $: passwordType = passwordsShown ? "text" : "password";

  // events
  function handleSubmit() {
    tokenStore.set(data.accessToken);
    submitWithToken(this, { allowRefresh: false });
  }
</script>

<h1>Enter Your New Password</h1>
{#if form?.response}
  <div style="text-align: center">
    <p>{form.response}</p>
  </div>
{/if}
<form method="POST" on:submit|preventDefault={handleSubmit}>
  <input required type={passwordType} name="password" placeholder="New Password" />
  <input required type={passwordType} name="confirmPassword" placeholder="New Password Again" />
  <div style="margin:20px;">
    <label for="showPasswords">Show Passwords: </label>
    <input type="checkbox" id="showPasswords" bind:checked={passwordsShown} />
  </div>
  <button type="submit">Reset Password</button>
</form>

<style>
  h1 {
    text-align: center;
  }

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
