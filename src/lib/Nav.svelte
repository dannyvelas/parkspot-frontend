<script lang="ts">
	import { getStores } from '$app/stores';
	import { emptyResponseDecoder } from '$lib/models';
	import { isOk } from '$lib/functional';
	import { goto } from '$app/navigation';
	import { post } from '$lib/api';
	const { session, page } = getStores();

	const dashboard = () => ($session.user.role === 'resident' ? `/resident` : '/admin');

	// events
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
		{#if $session.user}
			{#if $page.url.pathname !== '/admin' && $page.url.pathname !== '/resident'}
				<div style="text-align:center;">
					<a href={dashboard()}>Go Back To Dashboard</a>
				</div>
			{:else}
				<button on:click={logout}>Go Back To Start Page</button>
			{/if}
		{:else}
			<li><a href="/login" class:active={$page.url.pathname === '/login'}>Login</a></li>
			<li><a href="/register" class:active={$page.url.pathname === '/register'}>Register</a></li>
		{/if}
	</ul>
</nav>
