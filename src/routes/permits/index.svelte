<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ session: user }) => {
		if (!user) return { status: 302, redirect: '/' };
		console.log('load is running');
		return { props: { ok: true } };
	};
</script>

<script lang="ts">
	import PermitsList from './_PermitsList.svelte';

	export let ok: boolean;
	console.log(`script is running: ${ok}`);
</script>

<PermitsList
	listType="all"
	endpoint="api/permits"
	pageNumCb={(a) => `/permits?page=${a}`}
	reversed={ok}
/>
