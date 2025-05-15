<script lang="ts">
  import { enhance } from "$app/forms";
  import Password from "$lib/components/Password.svelte";

  
  interface Props {
    // props
    form: Record<string, any> | undefined;
  }

  let { form }: Props = $props();
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>
{#if form?.error}
  <div style="text-align: center">
    <p>{form.error}</p>
  </div>
{/if}
<div
  class="bg-gray-200 max-w-prose p-2 my-4 mx-auto rounded flex flex-row items-center justify-center gap-2"
>
  <iconify-icon icon="ph:info-light"></iconify-icon>
  <p>
    Need information about usernames in Las Vistas?
    <a href="https://park-spot.co/info-for-residents/" class="underline"> Click here! </a>
  </p>
</div>
<form method="POST" class="flex flex-col mx-auto w-64 gap-4" use:enhance>
  <input required class="border rounded p-2" name="id" type="username" placeholder="Username" />
  <Password name="password" placeholder="Password" />
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Log in
  </button>
  <div class="text-center">
    <a href="/forgot-password" class="text-green-500 underline">Forgot your Password?</a>
  </div>
</form>
