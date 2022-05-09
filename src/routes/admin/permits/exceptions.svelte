<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Permit } from '$lib/models';
	import { get } from '$lib/api';

	export const load: Load = async ({ session: { user } }) => {
		if (!user) return { status: 302, redirect: '/' };

		const permits = await get<Array<Permit>>(`api/admin/permits/exceptions`);

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
</script>

<svelte:head>
	<title>Exceptions</title>
</svelte:head>

<h1>Exceptions</h1>

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
					<td>Reason For Exception</td>
				</tr>
				{#each permits.data as permit}
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
