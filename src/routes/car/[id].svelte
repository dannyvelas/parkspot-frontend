<script context="module" lang="ts">
	import type { Load } from './[id]';
	import type { Car } from '$lib/models';
	import { carDecoder } from '$lib/models';
	import { getLoadFn } from '$lib/loadFn';

	export const load: Load = async (args) => {
		const loadFn = getLoadFn(`api/car/${args.params.id}`, carDecoder);
		return loadFn(args);
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import { isOk, newOk } from '$lib/functional';
	import { put } from '$lib/api';

	// props
	export let result: Result<Car>;

	// types
	type EditCarArgs = {
		color: string;
		make: string;
		model: string;
	};

	// model
	let car: Car;
	let editCarArgs: EditCarArgs;
	let bannerError: string;
	if (isOk(result)) {
		car = result.data;
		editCarArgs = {
			color: result.data.color,
			make: result.data.make,
			model: result.data.model
		};
		bannerError = '';
	}
	//****************************/

	const submit = async () => {
		const payload: Partial<EditCarArgs> = {
			color: editCarArgs.color || undefined,
			make: editCarArgs.make || undefined,
			model: editCarArgs.model || undefined
		};

		const putRes = await put<Partial<EditCarArgs>, Car>(`api/car/${car.id}`, payload, carDecoder);
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
	<p>License Plate: {car.licensePlate}</p>
	<form on:submit|preventDefault={submit}>
		Color:
		<input type="text" placeholder={car.color} bind:value={editCarArgs.color} />
		Make:
		<input type="text" placeholder={car.make} bind:value={editCarArgs.make} />
		Model:
		<input type="text" placeholder={car.model} bind:value={editCarArgs.model} />
		<button type="submit">Submit</button>
	</form>
{/if}
