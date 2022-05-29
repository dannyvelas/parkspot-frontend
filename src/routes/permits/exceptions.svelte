<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { MAX_AMT_PER_PAGE } from '$lib/constants';
	import { getLoadFn } from './_load';

	const limit = MAX_AMT_PER_PAGE;

	export const load: Load = getLoadFn('api/permits/exceptions', limit, false);
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
	<title>Exceptions</title>
</svelte:head>

<h1>Exceptions</h1>

{#if !isOk(result)}
	{result.message}
{:else}
	<PermitsList
		listType="exceptions"
		permits={result.data.records}
		totalAmount={result.data.metadata.totalAmount}
		pageToHref={(pageNum) => `/permits/exceptions?page=${pageNum}`}
		{currPageNum}
		{limit}
	/>
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
