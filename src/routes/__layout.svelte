<script lang="ts">
	import type { User } from '$lib/models';
	import Nav from '$lib/Nav.svelte';
	import { getStores } from '$app/stores';
	import { onMount } from 'svelte';
	import { getSession } from '$lib/getSession';
	import { goto } from '$app/navigation';
	const { session, page } = getStores();

	// helpers
	const dashboard = (user: User) => (user.role === 'resident' ? `/resident` : '/admin');
	const publicPages = ['/', '/login'];

	// init
	onMount(async () => {
		$session = await getSession();

		if ($session.user && publicPages.includes($page.url.pathname)) {
			goto(dashboard($session.user));
		} else if (!$session.user && !publicPages.includes($page.url.pathname)) {
			goto('/');
		}
	});
</script>

<Nav />

<main>
	<slot />
</main>
