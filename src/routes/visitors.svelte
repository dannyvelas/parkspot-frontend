<script context="module" lang="ts">
	import { DEFAULT_AMT_PER_PAGE } from '$lib/constants';
	import { visitorDecoder } from '$lib/models';
	import loadList from '$lib/loadList';

	const limit = DEFAULT_AMT_PER_PAGE;

	export const load = loadList('api/visitors', visitorDecoder, limit, true, 'admin');
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { Visitor, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import { afterNavigate } from '$app/navigation';
	import { searchVisitors } from '$lib/search';
	import VisitorList from '$lib/_VisitorList.svelte';
	import Pagination from '$lib/Pagination.svelte';

	// props
	export let result: Result<ListWithMetadata<Visitor>>;
	export let currPageNum: number;

	// model
	let initialVisitors: Array<Visitor>;
	let searchVal = '';
	let bannerError = '';

	// init
	afterNavigate(() => {
		initialVisitors = (result.data && result.data.records) || [];
	});

	// events
	const onSearch = async () => {
		const visitorRes = await searchVisitors(
			searchVal,
			initialVisitors,
			result.data!.metadata.totalAmount
		);
		if (!isOk(visitorRes)) {
			result.data!.records = initialVisitors;
			bannerError = visitorRes.message;
			return;
		}

		result.data!.records = visitorRes.data;
		bannerError = '';
	};
</script>

<svelte:head>
	<title>All Visitors</title>
</svelte:head>

<h1>All Visitors</h1>

{#if !isOk(result)}
	{result.message}
{:else}
	<div class="stack-container">
		{#if bannerError != ''}
			<div>
				<p>Error searching: {bannerError}. Please try again later.</p>
			</div>
		{/if}
		<input type="text" bind:value={searchVal} on:input={onSearch} placeholder="Search Visitors" />
		<VisitorList visitors={result.data.records} totalAmount={result.data.metadata.totalAmount} />
		<Pagination
			totalAmount={result.data.metadata.totalAmount}
			pageToHref={(pageNum) => `visitors?page=${pageNum}`}
			{currPageNum}
			{limit}
		/>
	</div>
{/if}

<style>
	.stack-container {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1 {
		text-align: center;
	}
</style>
