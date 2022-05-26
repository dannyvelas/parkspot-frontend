<script context="module" lang="ts">
	import type { Load } from './[id]';
	import type { Car } from '$lib/models';
	import { get } from '$lib/api';
	import { carDecoder } from '$lib/models';

	export const load: Load = async ({ session: { user }, params }) => {
		if (!user) return { status: 302, redirect: '/' };

		const result = await get(`api/car/${params.id}`, {}, carDecoder);

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import type { Result, Status } from '$lib/functional';
	import { isOk, newOk, newLoading } from '$lib/functional';
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
	let model: Status<{
		car: Car;
		editCarArgs: EditCarArgs;
		bannerError: string;
	}> = newLoading;
	if (!isOk(result)) {
		model = result;
	} else {
		model = newOk({
			car: result.data,
			editCarArgs: {
				color: result.data.color,
				make: result.data.make,
				model: result.data.model
			},
			bannerError: ''
		});
	}

	// events
	const submit = async () => {
		const payload: Partial<EditCarArgs> = {
			color: model.data!.editCarArgs.color || undefined,
			make: model.data!.editCarArgs.make || undefined,
			model: model.data!.editCarArgs.model || undefined
		};

		const putRes = await put<Partial<EditCarArgs>, Car>(
			`api/car/${model.data!.car.id}`,
			payload,
			carDecoder
		);
		if (!isOk(putRes)) {
			model.data!.bannerError = putRes.message;
			return;
		}

		model.data!.car = putRes.data;
	};
</script>

<svelte:head>
	<title>Edit Car</title>
</svelte:head>

{#if !isOk(model)}
	<p>Error: {model.message}</p>
{:else}
	<h1>Edit Car</h1>
	{#if model.data.bannerError != ''}
		<div>
			<p>Error editing permit: {model.data.bannerError}. Please try again later.</p>
		</div>
	{/if}
	<p>License Plate: {model.data.car.licensePlate}</p>
	<form on:submit|preventDefault={submit}>
		Color:
		<input
			type="text"
			placeholder={model.data.car.color}
			bind:value={model.data.editCarArgs.color}
		/>
		Make:
		<input type="text" placeholder={model.data.car.make} bind:value={model.data.editCarArgs.make} />
		Model:
		<input
			type="text"
			placeholder={model.data.car.model}
			bind:value={model.data.editCarArgs.model}
		/>
		<button type="submit">Submit</button>
	</form>
{/if}
