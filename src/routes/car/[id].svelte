<script context="module" lang="ts">
	import type { Load } from './[id]';
	import type { Car } from '$lib/models';
	import { carDecoder } from '$lib/models';
	import { get } from '$lib/api';

	export const load: Load = async ({ params, session: { user } }) => {
		if (!user) return { status: 302, redirect: '/' };

		const result = await get<Car>(`api/car/${params.id}`, carDecoder);

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import { put } from '$lib/api';
	import { isOk, newOk } from '$lib/functional';

	type EditCarArgs = {
		color: string;
		make: string;
		model: string;
	};

	export let result: Result<Car>;
	let carId = '';
	let editCarArgs: EditCarArgs;
	let bannerError = '';

	if (isOk(result)) {
		carId = result.data.id;

		editCarArgs = {
			color: result.data.color,
			make: result.data.make,
			model: result.data.model
		};
	}

	const submit = async () => {
		const payload: Partial<EditCarArgs> = {
			color: editCarArgs.color || undefined,
			make: editCarArgs.make || undefined,
			model: editCarArgs.model || undefined
		};

		const putRes = await put<Partial<EditCarArgs>, Car>(`api/car/${carId}`, payload, carDecoder);
		if (!isOk(putRes)) {
			bannerError = putRes.error;
			return;
		}

		result = newOk(putRes.data);
	};
</script>

<svelte:head>
	<title>Edit Car</title>
</svelte:head>

{#if !isOk(result)}
	<p>Error: {result.error}</p>
{:else}
	<h1>Edit Car</h1>
	{#if bannerError != ''}
		<div>
			<p>Error editing permit: {bannerError}. Please try again later.</p>
		</div>
	{/if}
	<p>License Plate: {result.data.licensePlate}</p>
	<form on:submit|preventDefault={submit}>
		Color:
		<input type="text" placeholder={result.data.color} bind:value={editCarArgs.color} />
		Make:
		<input type="text" placeholder={result.data.make} bind:value={editCarArgs.make} />
		Model:
		<input type="text" placeholder={result.data.model} bind:value={editCarArgs.model} />
		<button type="submit">Submit</button>
	</form>
{/if}
