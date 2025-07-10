<script lang="ts">
	import type { permitList } from '$lib/models';
	import { capitalize } from '$lib/strings';
	import { page } from '$app/state';

	// model
	let permitTabs: permitList[] = ['all', 'active', 'expired', 'exceptions'];
</script>

<svelte:head>
	<title>Permits</title>
</svelte:head>

<nav class="mb-4">
	<ul class="flex flex-row gap-4 border-b md:gap-12">
		{#each permitTabs as permitTab}
			<li>
				<a
					href="/permits/{permitTab}"
					class="text-sm text-gray-400"
					class:active={page.url.pathname.endsWith(permitTab)}
				>
					{capitalize(permitTab)}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<slot />

<style lang="postcss">
	@reference "tailwindcss";

	.active {
		@apply border-b-2 border-green-400 text-green-400;
	}
</style>
