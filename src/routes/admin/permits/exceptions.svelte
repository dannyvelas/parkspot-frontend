<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { permitLoad } from './_permitLoad';

	export const load: Load = async (args) => {
		const loadFn: Load = permitLoad('api/permits/exceptions');
		return loadFn(args);
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { Permit, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';

	export let result: Result<ListWithMetadata<Permit>>;
</script>

<svelte:head>
	<title>Exceptions</title>
</svelte:head>

<h1>Exceptions</h1>

{#if !isOk(result)}
	{result.error}
{:else}
	<div class="stack-container">
		<h2>Amount of Permits: {result.data.metadata.totalAmount}</h2>
		<div>
			<table>
				<tr>
					<td>Permit ID</td>
					<td>Resident ID</td>
					<td>License Plate</td>
					<td>Color</td>
					<td>Make</td>
					<td>Model</td>
					<td>Reason For Exception</td>
				</tr>
				{#each result.data.records as permit}
					<tr>
						<td>{permit.id}</td>
						<td>{permit.residentId}</td>
						<td>{permit.car.licensePlate}</td>
						<td>{permit.car.color}</td>
						<td>{permit.car.make}</td>
						<td>{permit.car.model}</td>
						<td>{permit.exceptionReason}</td>
					</tr>
				{/each}
			</table>
		</div>
	</div>
{/if}

<style>
	h1 {
		text-align: center;
	}

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
