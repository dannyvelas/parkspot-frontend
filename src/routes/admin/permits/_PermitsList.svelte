<script lang="ts">
	import type { Permit } from '$lib/models';
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
				<td>Delete</td>
			</tr>
			{#each permits as permit}
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
