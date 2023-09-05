<script lang="ts">
  import { enhance } from "$app/forms";
  import Password from "$lib/components/Password.svelte";

  // props
  export let form: Record<string, any> | undefined;
</script>

<svelte:head>
  <title>ParkSpot Sign Up</title>
</svelte:head>
{#if form?.error}
  <div style="text-align: center">
    <p>{form.error}</p>
  </div>
{/if}
<form method="POST" class="flex flex-col mx-auto w-64 gap-4" use:enhance>
  <input required class="border rounded p-2" name="communityName" placeholder="Community Name" />
  <input required class="border rounded p-2" name="email" type="username" placeholder="Email" />
  <Password name="password" placeholder="Password" />
  <Password name="confirmPassword" placeholder="Confirm Password" />
  <button type="submit" class="bg-green-400 text-white text-center border rounded px-4 py-1">
    Sign Up
  </button>
</form>
