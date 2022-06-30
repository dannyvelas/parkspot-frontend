<script lang="ts">
	import type { User } from '$lib/models';
	import { userDecoder } from '$lib/models';
	import { isOk } from '$lib/functional';
	import { getStores } from '$app/stores';
	import { goto } from '$app/navigation';
	import { post } from '$lib/api';
	const { session } = getStores();

	// model
	let id = '';
	let password = '';
	let error = '';

	// events
	const submit = async () => {
		const result = await post('api/login', { id, password }, userDecoder);
		if (!isOk(result)) {
			error = result.message;
			return;
		}

		$session.user = result.data;
		goto(dashboard($session.user));
	};

	// helpers
	const dashboard = (user: User) => (user.role === 'resident' ? `/resident` : '/admin');
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
