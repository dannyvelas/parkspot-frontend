<script context="module" lang="ts">
	import { DEFAULT_AMT_PER_PAGE } from '$lib/constants';
	import { getLoadFn } from '$lib/loadPermits';

	const limit = DEFAULT_AMT_PER_PAGE;

	export const load = getLoadFn('api/permits/active', limit, false);
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
	<title>Active Permits</title>
</svelte:head>

<h1>Active Permits</h1>

{#if !isOk(result)}
	{result.message}
{:else}
	<PermitsList
		listType="active"
		permits={result.data.records}
		totalAmount={result.data.metadata.totalAmount}
		pageToHref={(pageNum) => `/permits/active?page=${pageNum}`}
		{currPageNum}
		{limit}
	/>
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
