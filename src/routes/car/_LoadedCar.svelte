<script lang="ts">
	import type { Car } from '$lib/models';
	import { carDecoder } from '$lib/models';
	import { isOk } from '$lib/functional';
	import { put } from '$lib/api';
	export let car: Car;

	type EditCarArgs = {
		color: string;
		make: string;
		model: string;
	};

	const editCarArgs: EditCarArgs = {
		color: car.color,
		make: car.make,
		model: car.model
	};

	let bannerError = '';

	const submit = async () => {
		const payload: Partial<EditCarArgs> = {
			color: editCarArgs.color || undefined,
			make: editCarArgs.make || undefined,
			model: editCarArgs.model || undefined
		};

		const putRes = await put<Partial<EditCarArgs>, Car>(`api/car/${car.id}`, payload, carDecoder);
		if (!isOk(putRes)) {
			bannerError = putRes.message;
			return;
		}

		car = putRes.data;
	};
</script>

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
