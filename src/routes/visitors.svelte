<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { listWithMetadataDecoder, visitorDecoder } from '$lib/models';
	import { get } from '$lib/api';
	import { DEFAULT_AMT_PER_PAGE } from '$lib/constants';

	const limit = DEFAULT_AMT_PER_PAGE;

	export const load: Load = async ({ session, url }) => {
		if (!session.user) {
			return { status: 302, redirect: '/' };
		} else if (session.user.role !== 'admin') {
			return { status: 302, redirect: '/resident' };
		}

		const currPageNum = Number(url.searchParams.get('page')) || 1;
		const params = {
			limit: `${limit}`,
			page: `${currPageNum}`
		};

		const result = await get('api/visitors', params, listWithMetadataDecoder(visitorDecoder));

		return {
			props: {
				result,
				currPageNum
			}
		};
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { ListWithMetadata, Visitor } from '$lib/models';
	import { afterNavigate } from '$app/navigation';
	import { isOk } from '$lib/functional';
	import Pagination from '$lib/Pagination.svelte';

	// props
	export let result: Result<ListWithMetadata<Visitor>>;
	export let currPageNum: number;

	// model
	let initialVisitors: Array<Visitor>;
	let searchVal = '';
	let bannerError = '';

	// initialize initialVisitors
	afterNavigate(() => {
		initialVisitors = (result.data && result.data.records) || [];
	});

	// rendering
	const renderDate = (date: Date): string => {
		const dateStr = date.toISOString();
		return dateStr.split('T')[0];
	};

	// events
	const onSearch = async () => {
		// restore view when nothing is being searched
		if (searchVal === '') {
			result.data!.records = initialVisitors;
			bannerError = '';
			return;
		}

		const getRes = await get(
			'api/visitors/search',
			{ search: searchVal },
			listWithMetadataDecoder(visitorDecoder)
		);
		if (!isOk(getRes)) {
			result.data!.records = initialVisitors;
			bannerError = getRes.message;
			return;
		}

		result.data!.records = getRes.data.records;
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
		<h2>Amount of Visitors: {result.data.metadata.totalAmount}</h2>
		<div>
			<table>
				<tr>
					<td>Resident ID</td>
					<td>First Name</td>
					<td>Last Name</td>
					<td>Relationship</td>
					<td>Access Start</td>
					<td>Access End</td>
				</tr>
				{#each result.data.records as visitor}
					<tr>
						<td>{visitor.residentId}</td>
						<td>{visitor.firstName}</td>
						<td>{visitor.lastName}</td>
						<td>{visitor.relationship}</td>
						<td>{renderDate(visitor.accessStart)}</td>
						<td>{renderDate(visitor.accessEnd)}</td>
					</tr>
				{/each}
			</table>
		</div>
		<Pagination
			totalAmount={result.data.metadata.totalAmount}
			pageToHref={(page) => `visitors?page=${page}`}
			{currPageNum}
			{limit}
		/>
	</div>
{/if}

<style>
	table,
	td {
		border: 1px solid black;
	}

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
