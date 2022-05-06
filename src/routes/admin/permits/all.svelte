<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Permit } from '$lib/models';
	import { get } from '$lib/api';

	export const load: Load = async ({ session: { user } }) => {
		if (!user) return { status: 302, redirect: '/' };

		const permits = await get<Array<Permit>>(`api/admin/permits/all`);

		return {
			props: {
				permits
			}
		};
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import { isOk } from '$lib/functional';
	export let permits: Result<Array<Permit>>;

	const renderDate = (rfc3339: string): string => {
		const date = new Date(rfc3339);
		const dateStr = date.toISOString();

		return dateStr.split('T')[0];
	};
	const tsToDate = (ts: number): string => {
		const date = new Date(ts * 1000);
		const offset = date.getTimezoneOffset();
		const offset_date = new Date(date.getTime() - offset * 60 * 1000).toISOString();
		return offset_date.replace('T', ' ').split('.')[0];
	};
</script>

<svelte:head>
	<title>All Permits</title>
</svelte:head>

<h1>All Permits</h1>

{#if !isOk(permits)}
	{permits.error}
{:else}
	<div class="stack-container">
		<h2>Amount of Permits: {permits.data.length}</h2>
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
					<td>Delete</td>
				</tr>
				{#each permits.data as permit}
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
						<td><button>Delete</button></td>
					</tr>
				{/each}
			</table>
		</div>
	</div>
{/if}

<style>
	table,
	td {
		border: 1px solid black;
	}

	h1 {
		text-align: center;
	}

	.stack-container {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
