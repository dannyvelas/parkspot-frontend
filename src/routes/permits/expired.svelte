<script context="module" lang="ts">
	import { DEFAULT_AMT_PER_PAGE } from '$lib/constants';
	import { permitDecoder } from '$lib/models';
	import loadList from '$lib/loadList';

	const limit = DEFAULT_AMT_PER_PAGE;

	export const load = loadList('api/permits/expired', permitDecoder, limit, false, 'admin');
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { Permit, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import PermitsList from '$lib/_PermitsList.svelte';

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
		listType="expired"
		permits={result.data.records}
		totalAmount={result.data.metadata.totalAmount}
		pageToHref={(pageNum) => `/permits/expired?page=${pageNum}`}
		{currPageNum}
		{limit}
	/>
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
