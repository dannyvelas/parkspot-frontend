<script lang="ts">
	import type { Visitor } from '$lib/models';

	// props
	export let visitors: Array<Visitor>;
	export let totalAmount: number;

	// rendering
	const renderDate = (date: Date): string => {
		const dateStr = date.toISOString();
		return dateStr.split('T')[0];
	};
</script>

<svelte:head>
	<title>All Visitors</title>
</svelte:head>

<div>
	<h2>Amount of Visitors: {totalAmount}</h2>
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
			{#each visitors as visitor}
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
</div>

<style>
	table,
	td {
		border: 1px solid black;
	}

	h2 {
		text-align: center;
	}
</style>
