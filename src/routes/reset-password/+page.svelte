<script lang="ts">
  import { put } from "$lib/api";
  import { messageDecoder } from "$lib/models";
  import { isOk } from "$lib/functional";

  // props
  export let accessToken: string;

  // model
  let password = "";
  let confirmPassword = "";
  let passwordsShown = false;
  $: passwordType = passwordsShown ? "text" : "password";
  let banner = "";

  // events
  const inputPassword = (e: any) => {
    password = e.target.value;
  };
  const inputConfirmPassword = (e: any) => {
    confirmPassword = e.target.value;
  };

  const submit = async () => {
    if (password !== confirmPassword) {
      banner = "Error: passwords do not match";
      return;
    }

    const payload = { password };
    const putRes = await put(`api/account/password`, payload, messageDecoder, accessToken);
    if (!isOk(putRes)) {
      banner = putRes.message;
      return;
    }

    banner = putRes.data.message;
  };
</script>

<h1>Enter Your New Password</h1>
{#if banner != ""}
  <div style="text-align: center">
    <p>{banner}</p>
  </div>
{/if}
<form on:submit|preventDefault={submit}>
  <input required type={passwordType} placeholder="New Password" on:input={inputPassword} />
  <input
    required
    type={passwordType}
    placeholder="New Password Again"
    on:input={inputConfirmPassword}
  />
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
