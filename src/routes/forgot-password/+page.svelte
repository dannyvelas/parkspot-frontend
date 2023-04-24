<script lang="ts">
  import { enhance } from "$app/forms";

  // props
  export let form: Record<string, any> | undefined;
</script>

<h1 class="font-bold text-center m-4">Reset Password</h1>
{#if form?.response}
  <div style="text-align: center">
    <p>{form.response}</p>
  </div>
{/if}
<form method="POST" class="flex flex-col mx-auto w-52 md:w-64 gap-4" use:enhance>
  <div class="flex flex-col">
    <label for="username">Enter Username:</label>
    <input
      required
      class="grow border rounded p-2"
      id="username"
      name="id"
      placeholder="T8100123"
    />
  </div>
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Send Email To Reset Password
  </button>
</form>
