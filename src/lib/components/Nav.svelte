<script lang="ts">
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import logo from '$lib/assets/logo.png';
	import type { Session } from '$lib/auth';

	interface Props {
		// props
		session: Session | undefined;
		openSidebar: () => void;
	}

	let { session, openSidebar }: Props = $props();

	// model
	let dropdownOpen = $state(false);

	// events
	async function logout() {
		if (session) {
			const postRes = await fetch('/logout', { method: 'POST' });
			if (!postRes.ok) {
				console.error('Error logging out');
			}

			dropdownOpen = false;
			invalidateAll();
		}
	}
</script>

<nav class="mb-6 flex flex-row items-center justify-between bg-green-400 px-6 py-3.5">
	<div class="flex flex-row gap-x-4">
		{#if session}
			<button onclick={() => openSidebar()} aria-label="menu-hamburger">
				<iconify-icon class="inline-block align-middle text-white" icon="charm:menu-hamburger"
				></iconify-icon>
			</button>
		{/if}
		<a href="/"><img class="h-auto w-28" alt="ParkSpot Logo" src={logo} /></a>
	</div>
	{#if session}
		<button class="relative cursor-default" onclick={() => (dropdownOpen = !dropdownOpen)}>
			<span class="hidden text-xs text-white md:inline">{session.user.firstName}</span>
			<iconify-icon class="inline-block align-middle text-white" icon="dashicons:arrow-down-alt2"
			></iconify-icon>
		</button>
		{#if dropdownOpen}
			<div class="absolute right-0 z-0 bg-stone-50 shadow">
				<button class="mx-3 my-2 text-xs" onclick={logout} onkeypress={logout}>Logout</button>
			</div>
		{/if}
	{:else}
		<a href="/login" class="text-white" class:active={page.url.pathname === '/login'}>Login</a>
	{/if}
</nav>
