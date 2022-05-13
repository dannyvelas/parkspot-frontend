<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Resident } from '$lib/models';
	import { residentDecoder } from '$lib/models';
	import { array } from 'decoders';
	import { get } from '$lib/api';

	export const load: Load = async ({ session: { user } }) => {
		if (!user) return { status: 302, redirect: '/' };

		const residents = await get<Array<Resident>>(`api/admin/residents`, array(residentDecoder));

		return {
			props: {
				residents
			}
		};
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import { isOk } from '$lib/functional';

	export let residents: Result<Array<Resident>>;
</script>

<svelte:head>
	<title>All Residents</title>
</svelte:head>

<h1>All Residents</h1>

{#if !isOk(residents)}
	{residents.error}
{:else}
	<div class="stack-container">
		<h2>Amount of Residents: {residents.data.length}</h2>
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
				{#each residents.data as resident}
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
