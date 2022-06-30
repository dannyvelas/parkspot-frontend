<script lang="ts">
	import type { User } from '$lib/models';
	import Nav from '$lib/Nav.svelte';
	import { getStores } from '$app/stores';
	import { onMount } from 'svelte';
	import { hydrateSession } from '$lib/hydrateSession';
	import { goto } from '$app/navigation';
	const { session, page } = getStores();

	// helpers
	const dashboard = (user: User) => (user.role === 'resident' ? `/resident` : '/admin');
	const publicPages = ['/', '/login'];

	// init
	onMount(async () => {
		const hydratedSession = await hydrateSession($session);
		if ($session.user != hydratedSession.user) {
			$session = hydratedSession;
		}

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
