<script lang="ts">
	import type { User, Car } from '$lib/models';
	import { Request } from '$lib/api';
	import { getLatestToken } from '$lib/auth/jwt';
	import { isOk } from '$lib/functional';
	import { listWithMetadataDecoder, carDecoder, residentDecoder, permitDecoder } from '$lib/models';
	import Banner, { updateBanner, clearBanner } from '$lib/components/Banner.svelte';
	import Litepicker, { getStartDate, getEndDate } from '$lib/components/Litepicker.svelte';
	import type { Permit } from '$lib/models';

	interface Props {
		user: User;
		onCreated: (permit: Permit) => void;
	}

	let { user, onCreated }: Props = $props();

	// model
	let carSelection = $state('');
	let isException = $state(false);
	let residentCars: Car[] = $state([]);
	let residentID = $state(user.role === 'resident' ? user.id : '');

	// init
	if (user.role === 'resident') {
		seedResidentCars();
	}

	// events
	async function seedResidentCars() {
		const carRes = await new Request(listWithMetadataDecoder(carDecoder))
			.setAccessToken(await getLatestToken())
			.get(`api/resident/${residentID}/cars`);
		if (!isOk(carRes)) {
			updateBanner(true, carRes.message);
			return;
		}

		clearBanner();
		residentCars = carRes.data.records;
	}

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		if (carSelection !== 'newCar') {
			formData.set('carID', carSelection);
		}
		formData.set('startDate', getStartDate().toISOString());
		formData.set('endDate', getEndDate().toISOString());

		const formObject = Object.fromEntries(formData.entries());
		const result = await new Request(permitDecoder)
			.setAccessToken(await getLatestToken())
			.post('api/permit', formObject);
		if (!isOk(result)) {
			updateBanner(true, result.message);
			return;
		}

		clearBanner();
		onCreated(result.data);
	}

	async function safeSeedResidentCars() {
		if (!residentID) {
			return;
		}
		const residentRes = await new Request(residentDecoder)
			.setAccessToken(await getLatestToken())
			.get(`api/resident/${residentID}`);
		if (!isOk(residentRes)) {
			updateBanner(true, residentRes.message);
			return;
		}

		seedResidentCars();
	}
</script>

<form class="mx-auto flex w-52 flex-col gap-4 bg-white md:w-64" onsubmit={handleSubmit}>
	<Banner />
	<p class="text-center text-lg font-bold">Create Permit</p>
	{#if user.role !== 'resident'}
		<input
			required
			class="rounded border p-2"
			name="residentID"
			placeholder="Enter Resident ID"
			bind:value={residentID}
			onblur={safeSeedResidentCars}
		/>
	{/if}
	<select class="rounded border p-2" bind:value={carSelection}>
		<option value="" disabled selected>Select Car</option>
		{#each residentCars as car}
			<option value={car.id}>{car.color} {car.make} {car.model}</option>
		{/each}
		<option value="newCar">Add a new car</option>
	</select>
	{#if carSelection === 'newCar'}
		<input class="rounded border p-2" name="licensePlate" placeholder="Enter License Plate" />
		<input class="rounded border p-2" name="color" placeholder="Enter Color" />
		<input class="rounded border p-2" name="make" placeholder="Enter Make" />
		<input class="rounded border p-2" name="model" placeholder="Enter Model" />
	{/if}
	<Litepicker />
	{#if user.role === 'admin'}
		<div class="text-center">
			<label for="isException">Exception: </label>
			<input id="isException" type="checkbox" bind:checked={isException} />
		</div>
		{#if isException}
			<textarea
				class="resize-none rounded border p-2"
				name="exceptionReason"
				placeholder="Reason for exception"
			></textarea>
		{/if}
	{/if}
	<button type="submit" class="rounded border bg-green-400 px-4 py-1 text-center text-white">
		Create Permit
	</button>
</form>
