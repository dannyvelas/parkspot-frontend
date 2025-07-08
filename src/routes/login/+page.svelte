<script lang="ts">
	import { enhance } from '$app/forms';
	import Password from '$lib/components/Password.svelte';

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
	class="mx-auto my-4 flex max-w-prose flex-row items-center justify-center gap-2 rounded bg-gray-200 p-2"
>
	<iconify-icon icon="ph:info-light"></iconify-icon>
	<p>
		Need information about usernames in Las Vistas?
		<a href="https://park-spot.co/info-for-residents/" class="underline"> Click here! </a>
	</p>
</div>
<form method="POST" class="mx-auto flex w-64 flex-col gap-4" use:enhance>
	<input required class="rounded border p-2" name="id" type="username" placeholder="Username" />
	<Password name="password" placeholder="Password" />
	<button type="submit" class="rounded border bg-green-400 px-4 py-1 text-center text-white">
		Log in
	</button>
	<div class="text-center">
		<a href="/forgot-password" class="text-green-500 underline">Forgot your Password?</a>
	</div>
</form>
