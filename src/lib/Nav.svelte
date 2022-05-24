<script lang="ts">
	import { getStores } from '$app/stores';
	import { emptyResponseDecoder } from '$lib/models';
	import { isOk } from '$lib/functional';
	import { goto } from '$app/navigation';
	import { post } from '$lib/api';
	const { session, page } = getStores();

	async function logout() {
		const postRes = await post(`api/logout`, {}, emptyResponseDecoder);
		if (!isOk(postRes)) {
			console.error('Error logging out');
		}

		$session.user = undefined;
		goto('/');
	}
</script>

<nav>
	<ul>
		<li>
			<a class:active={$page.url.pathname === '/'} href="/">Home</a>
		</li>
		{#if $session.user}
			<li><a href="/admin">Dashboard</a></li>
			<li><button on:click={logout}>Logout</button></li>
		{:else}
			<li><a href="/login" class:active={$page.url.pathname === '/login'}>Login</a></li>
			<li><a href="/register" class:active={$page.url.pathname === '/register'}>Register</a></li>
		{/if}
	</ul>
</nav>
