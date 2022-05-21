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
	import { isOk } from '$lib/functional';
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
	type Model = {
		car: Car;
		editCarArgs: EditCarArgs;
		bannerError: string;
	};
	let model: Model;
	if (isOk(result)) {
		model = {
			car: result.data,
			editCarArgs: {
				color: result.data.color,
				make: result.data.make,
				model: result.data.model
			},
			bannerError: ''
		};
	}

	// events
	const submit = async () => {
		const payload: Partial<EditCarArgs> = {
			color: model.editCarArgs.color || undefined,
			make: model.editCarArgs.make || undefined,
			model: model.editCarArgs.model || undefined
		};

		const putRes = await put<Partial<EditCarArgs>, Car>(
			`api/car/${model.car.id}`,
			payload,
			carDecoder
		);
		if (!isOk(putRes)) {
			model.bannerError = putRes.error;
			return;
		}

		model.car = putRes.data;
	};
</script>

<svelte:head>
	<title>Edit Car</title>
</svelte:head>

{#if !isOk(result)}
	<p>Error: {result.error}</p>
{:else}
	<h1>Edit Car</h1>
	{#if model.bannerError != ''}
		<div>
			<p>Error editing permit: {model.bannerError}. Please try again later.</p>
		</div>
	{/if}
	<p>License Plate: {model.car.licensePlate}</p>
	<form on:submit|preventDefault={submit}>
		Color:
		<input type="text" placeholder={model.car.color} bind:value={model.editCarArgs.color} />
		Make:
		<input type="text" placeholder={model.car.make} bind:value={model.editCarArgs.make} />
		Model:
		<input type="text" placeholder={model.car.model} bind:value={model.editCarArgs.model} />
		<button type="submit">Submit</button>
	</form>
{/if}
