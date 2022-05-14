<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { permitLoad } from './_permitLoad';

	export const load: Load = async (args) => {
		const loadFn: Load = permitLoad('api/admin/permits');
		return loadFn(args);
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { Permit, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import PermitsList from './_PermitsList.svelte';

	export let result: Result<ListWithMetadata<Permit>>;
</script>

<svelte:head>
	<title>Active Permits</title>
</svelte:head>

<h1>Active Permits</h1>

{#if !isOk(result)}
	{result.error}
{:else}
	<PermitsList totalAmount={result.data.metadata.totalAmount} permits={result.data.records} />
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
