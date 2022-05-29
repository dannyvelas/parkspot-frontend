<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Resident } from '$lib/models';
	import { MAX_AMT_PER_PAGE } from '$lib/constants';
	import { residentDecoder, listWithMetadataDecoder } from '$lib/models';
	import { get } from '$lib/api';

	const limit = MAX_AMT_PER_PAGE;

	export const load: Load = async (loadInput) => {
		if (!loadInput.session.user) return { status: 302, redirect: '/' };

		const currPageNum = Number(loadInput.url.searchParams.get('page')) || 1;
		const params = {
			reversed: 'false',
			limit: `${limit}`,
			page: `${currPageNum}`
		};

		const result = await get('api/residents', params, listWithMetadataDecoder(residentDecoder));

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
	import type { ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import Pagination from '$lib/Pagination.svelte';

	export let result: Result<ListWithMetadata<Resident>>;
	export let currPageNum: number;
</script>

<svelte:head>
	<title>All Residents</title>
</svelte:head>

<h1>All Residents</h1>

{#if !isOk(result)}
	{result.message}
{:else}
	<div class="stack-container">
		<h2>Amount of Residents: {result.data.metadata.totalAmount}</h2>
		<div>
			<table>
				<tr>
					<td>Resident ID</td>
					<td>First Name</td>
					<td>Last Name</td>
					<td>Phone</td>
					<td>Email</td>
					<td>Unlimited Days</td>
					<td>Edit</td>
					<td>Delete</td>
				</tr>
				{#each result.data.records as resident}
					<tr>
						<td>{resident.id}</td>
						<td>{resident.firstName}</td>
						<td>{resident.lastName}</td>
						<td>{resident.phone}</td>
						<td>{resident.email}</td>
						<td>{resident.unlimDays}</td>
						<td><button>Edit</button></td>
						<td><button>Delete</button></td>
					</tr>
				{/each}
			</table>
		</div>
		<Pagination
			totalAmount={result.data.metadata.totalAmount}
			pageToHref={(page) => `residents?page=${page}`}
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
