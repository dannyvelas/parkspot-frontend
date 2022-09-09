<script lang="ts">
  import { enhance } from '$app/forms';

  // props
  export let form: Record<string, any> | undefined;
</script>

<h1>Request a Password Reset Email</h1>
<h2>Enter your Account ID</h2>
{#if form?.error}
  <div style="text-align: center">
    <p>{form.error}</p>
  </div>
{/if}
<form method="POST" use:enhance>
  <input required name="id" type="text" placeholder="T8100123" />
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
