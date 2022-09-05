<script lang="ts">
  import { post } from "$lib/api/send";
  import { messageDecoder } from "$lib/models";
  import { isOk } from "$lib/functional";

  let id = "";
  let banner = "";

  const submit = async () => {
    const payload = { id };

    const postRes = await post(`api/password-reset-email`, payload, messageDecoder);
    if (!isOk(postRes)) {
      banner = postRes.message;
      return;
    }

    banner = postRes.data.message;
  };
</script>

<h1>Request a Password Reset Email</h1>
<h2>Enter your Account ID</h2>
{#if banner != ""}
  <div style="text-align: center">
    <p>{banner}</p>
  </div>
{/if}
<form on:submit|preventDefault={submit}>
  <input required type="text" placeholder="T8100123" bind:value={id} />
  <button type="submit" style="margin:10px;">Send Email To Reset Password</button>
</form>

<style>
  h1,
  h2 {
    text-align: center;
  }

  form {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input[type="text"] {
    padding: 12px 20px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
