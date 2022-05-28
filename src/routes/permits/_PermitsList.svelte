<script lang="ts">
	import type { Permit } from '$lib/models';
	import { del, get } from '$lib/api';
	import { afterNavigate } from '$app/navigation';
	import { listWithMetadataDecoder, permitDecoder } from '$lib/models';
	import { isOk } from '$lib/functional';
	import Pagination from '$lib/Pagination.svelte';

	// props
	export let listType: 'all' | 'expired' | 'active';
	export let permits: Array<Permit>;
	export let totalAmount: number;
	export let pageToHref: (a: number) => string; // pagination
	export let currPageNum: number; // pagination
	export let limit: number; // pagination

	// model
	let initialPermits: Array<Permit>;
	let searchVal = '';
	let bannerError = '';

	// initialize initialPermits
	afterNavigate(() => {
		initialPermits = permits;
	});

	// rendering
	const renderDate = (date: Date): string => {
		const dateStr = date.toISOString();
		return dateStr.split('T')[0];
	};
	const tsToDate = (ts: number): string => {
		const date = new Date(ts * 1000);
		const offset = date.getTimezoneOffset();
		const offset_date = new Date(date.getTime() - offset * 60 * 1000).toISOString();
		return offset_date.replace('T', ' ').split('.')[0];
	};

	// events
	const deletePermit = async (i: number, permitId: number) => {
		if (confirm(`Are you sure you want to delete ${permitId}?`)) {
			const delRes = await del(`api/permit/${permitId}`);
			if (!isOk(delRes)) {
				alert(`Error deleting permit ${permitId}. Please try again later`);
				return;
			}

			permits = [...permits.slice(0, i), ...permits.slice(i + 1)];

			alert(`Deleted permit ${permitId}`);
		}
	};
	const onSearch = async () => {
		// restore view when nothing is being searched
		if (searchVal === '') {
			permits = initialPermits;
			bannerError = '';
			return;
		}

		// these lists are usually so short, that all of the searchable permits are inside `initialPermits`
		// so we can simply filter through `initialPermits`
		if (listType === 'active' || listType === 'expired') {
			permits = initialPermits.filter((permit) => {
				const searchableFields = `
        ${permit.id}
        ${permit.residentId}
        ${permit.car.licensePlate}
        ${permit.car.color}
        ${permit.car.make}
        ${permit.car.model}`.toLowerCase();
				return searchableFields.includes(searchVal.toLowerCase());
			});
			bannerError = '';
			return;
		}

		// listType === 'all', we need to use the endpoint to search across all permits
		const getRes = await get(
			'api/permits/search',
			{ search: searchVal },
			listWithMetadataDecoder(permitDecoder)
		);
		if (!isOk(getRes)) {
			permits = initialPermits;
			bannerError = getRes.message;
			return;
		}

		permits = getRes.data.records;
		bannerError = '';
	};
</script>

<div class="stack-container">
	{#if bannerError != ''}
		<div>
			<p>Error searching: {bannerError}. Please try again later.</p>
		</div>
	{/if}
	<input type="text" bind:value={searchVal} on:input={onSearch} placeholder="Search Permits" />
	<h2>Amount of Permits: {totalAmount}</h2>
	<div>
		<table>
			<tr>
				<td>Permit ID</td>
				<td>Resident ID</td>
				<td>License Plate</td>
				<td>Color</td>
				<td>Make</td>
				<td>Model</td>
				<td>Start Date</td>
				<td>End Date</td>
				<td>Request Date</td>
				<td>Edit</td>
				<td>Delete</td>
			</tr>
			{#each permits as permit, i (permit.id)}
				<tr>
					<td>{permit.id}</td>
					<td>{permit.residentId}</td>
					<td>{permit.car.licensePlate}</td>
					<td>{permit.car.color}</td>
					<td>{permit.car.make}</td>
					<td>{permit.car.model}</td>
					<td>{renderDate(permit.startDate)}</td>
					<td>{renderDate(permit.endDate)}</td>
					<td>{tsToDate(permit.requestTS)}</td>
					<td><a href="car/{permit.car.id}">Edit</a></td>
					<td><button on:click={() => deletePermit(i, permit.id)}>Delete</button></td>
				</tr>
			{/each}
		</table>
	</div>
	<Pagination {totalAmount} {pageToHref} {currPageNum} {limit} />
</div>

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
</style>
