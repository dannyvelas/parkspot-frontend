<script lang="ts">
	import type { Permit } from '$lib/models';
	import { del } from '$lib/api';
	import { isOk } from '$lib/functional';

	export let permits: Array<Permit>;
	export let totalAmount: number;

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

	const deletePermit = async (i: number, permitId: number) => {
		if (confirm(`Are you sure you want to delete ${permitId}?`)) {
			const delRes = await del(`api/permit/${permitId}`);
			if (!isOk(delRes)) {
				alert(`Error deleting permit ${permitId}. Please try again later`);
				return;
			}

			permits = [...permits.slice(0, i), ...permits.slice(i + 1)];

			alert(`Deleted permit ${permitId}`);
		} else {
			alert('you clicked no');
		}
	};
</script>

<div class="stack-container">
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
