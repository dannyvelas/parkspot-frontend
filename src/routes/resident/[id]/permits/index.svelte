<script context="module" lang="ts">
	import { DEFAULT_AMT_PER_PAGE } from '$lib/constants';
	import { getLoadFn } from '$lib/loadPermits';
	import type { Load } from '@sveltejs/kit';

	const limit = DEFAULT_AMT_PER_PAGE;

	export const load: Load = async (args) => {
		const residentId = args.params.id;
		const out = await getLoadFn(`api/resident/${residentId}/permits`, limit, false)(args);
		return {
			props: {
				residentId,
				...out.props
			}
		};
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { Permit, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import PermitsList from '$lib/_PermitsList.svelte';

	export let result: Result<ListWithMetadata<Permit>>;
	export let currPageNum: number;
	export let residentId: string;
</script>

<svelte:head>
	<title>All Permits</title>
</svelte:head>

<h1>All Permits</h1>

{#if !isOk(result)}
	{result.message}
{:else}
	<PermitsList
		listType="all"
		permits={result.data.records}
		totalAmount={result.data.metadata.totalAmount}
		pageToHref={(pageNum) => `/resident/${residentId}/permits?page=${pageNum}`}
		{currPageNum}
		{limit}
	/>
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
