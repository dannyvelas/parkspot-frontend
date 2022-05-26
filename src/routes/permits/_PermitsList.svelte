<script lang="ts">
	import type { Permit } from '$lib/models';
	import type { Status } from '$lib/functional';
	import { getStores } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { listWithMetadataDecoder, permitDecoder } from '$lib/models';
	import { get, del } from '$lib/api';
	import { DEFAULT_AMT_PER_PAGE } from '$lib/constants';
	import Pagination from '$lib/Pagination.svelte';
	import { newOk, newErr, newLoading, isOk } from '$lib/functional';
	const { page } = getStores();

	type ListType = 'active' | 'expired' | 'all';

	// props
	export let listType: ListType;
	export let endpoint: string;
	export let pageNumCb: (a: number) => string;
	export let reversed: boolean;
	export let limit = DEFAULT_AMT_PER_PAGE;

	// this is set in afterNavigate
	let model: Status<{
		permits: Array<Permit>;
		totalAmount: number;
		currPageNum: number;
	}> = newLoading;

	afterNavigate(async () => {
		const tempCurrPageNum = Number($page.url.searchParams.get('page')) || 1;
		const params: Record<string, string> = {
			page: `${tempCurrPageNum}`,
			limit: `${limit}`,
			reversed: `${reversed ?? false}`
		};

		const getRes = await get(endpoint, params, listWithMetadataDecoder(permitDecoder));
		if (!isOk(getRes)) {
			model = newErr(getRes.message);
			return;
		}

		model = newOk({
			permits: getRes.data.records,
			totalAmount: getRes.data.metadata.totalAmount,
			currPageNum: tempCurrPageNum
		});
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

			model.data!.permits = [
				...model.data!.permits.slice(0, i),
				...model.data!.permits.slice(i + 1)
			];

			alert(`Deleted permit ${permitId}`);
		}
	};
</script>

<svelte:head>
	<title>{listType.toUpperCase()} Permits</title>
</svelte:head>

<h1>{listType.toUpperCase()} Permits</h1>

{#if !isOk(model)}
	{model.message}
{:else}
	<div class="stack-container">
		<h2>Amount of Permits: {model.data.totalAmount}</h2>
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
				{#each model.data.permits as permit, i (permit.id)}
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
						<td><a href="/car/{permit.car.id}">Edit</a></td>
						<td><button on:click={() => deletePermit(i, permit.id)}>Delete</button></td>
					</tr>
				{/each}
			</table>
		</div>
		<Pagination
			totalAmount={model.data.totalAmount}
			href={pageNumCb}
			currPageNum={model.data.currPageNum}
			amountPerPage={limit}
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
</style>
