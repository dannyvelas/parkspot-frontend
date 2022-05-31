<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (session.user) {
			const dashboard = session.user.role === 'resident' ? `/resident` : '/admin';
			return { status: 302, redirect: dashboard };
		}

		return {};
	};
</script>

<script lang="ts">
	import type { Admin } from '$lib/models';
	import { adminDecoder } from '$lib/models';
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
		const result = await post<Credentials, Admin>('api/login', { id, password }, adminDecoder);
		if (!isOk(result)) {
			error = result.message;
			return;
		}

		$session.user = { ...result.data, role: 'admin' };
		goto('/admin');
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
