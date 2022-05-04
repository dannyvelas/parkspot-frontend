<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (session.user) {
			return { status: 302, redirect: '/' };
		} else {
			return {};
		}
	};
</script>

<script lang="ts">
	import type { Admin } from '$lib/models';
	import { isOk } from '$lib/functional';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { post } from '$lib/api';

	type Credentials = {
		id: string;
		password: string;
	};
	const { session } = getStores();

	let id = '';
	let password = '';
	let error = '';

	const submit = async () => {
		const result = await post<Credentials, Admin>('api/login', { id, password });
		if (isOk(result)) {
			$session.user = result.data;
			goto('/admin');
		} else {
			console.log(result.error);
			error = result.error;
		}
	};
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>
{#if error}
	<p>{error}</p>
{/if}
<form on:submit|preventDefault={submit}>
	<fieldset class="form-group">
		<input type="username" required placeholder="Username" bind:value={id} />
	</fieldset>
	<fieldset class="form-group">
		<input type="password" required placeholder="Password" bind:value={password} />
	</fieldset>
	<button type="submit"> Sign in </button>
</form>
