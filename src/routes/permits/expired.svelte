<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { listWithMetadataDecoder, permitDecoder } from '$lib/models';
	import { getLoadFn } from '$lib/loadFn';
	import { DEFAULT_AMT_PER_PAGE } from '$lib/constants';

	const amountPerPage = DEFAULT_AMT_PER_PAGE;

	export const load: Load = async (args) => {
		const loadFn = getLoadFn(
			'api/permits/expired',
			{ limit: `${amountPerPage}` },
			listWithMetadataDecoder(permitDecoder)
		);
		return loadFn(args);
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { Permit, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import PermitsList from './_PermitsList.svelte';

	export let result: Result<ListWithMetadata<Permit>>;
	export let currPageNum: number;
</script>

<svelte:head>
	<title>Expired Permits</title>
</svelte:head>

<h1>Expired Permits</h1>

{#if !isOk(result)}
	{result.message}
{:else}
	<PermitsList
		totalAmount={result.data.metadata.totalAmount}
		permits={result.data.records}
		href={(pageNum) => `/permits/expired?page=${pageNum}`}
		{currPageNum}
		{amountPerPage}
	/>
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
