<script lang="ts">
	import type { User, Car } from '$lib/models';
	import { Request } from '$lib/api';
	import { getLatestToken } from '$lib/auth/jwt';
	import { isOk } from '$lib/functional';
	import { carDecoder } from '$lib/models';
	import Banner, { updateBanner, clearBanner } from '$lib/components/Banner.svelte';

	interface Props {
		user: User;
		onCreated: (car: Car) => void;
	}

	let { user, onCreated }: Props = $props();

	// model
	let residentID = $state(user.role === 'resident' ? user.id : '');

	// events
	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const formObject = Object.fromEntries(formData.entries());
		const result = await new Request(carDecoder)
			.setAccessToken(await getLatestToken())
			.post('api/car', formObject);
		if (!isOk(result)) {
			updateBanner(true, result.message);
			return;
		}

		clearBanner();
		onCreated(result.data);
	}
</script>

<form class="mx-auto flex w-52 flex-col gap-4 bg-white md:w-64" onsubmit={handleSubmit}>
	<Banner />
	<p class="text-center text-lg font-bold">Create Car</p>
	{#if user.role !== 'resident'}
		<input
			required
			class="rounded border p-2"
			name="residentID"
			placeholder="Enter Resident ID"
			bind:value={residentID}
		/>
	{/if}
	<input
		required
		class="rounded border p-2"
		name="licensePlate"
		placeholder="Enter License Plate"
	/>
	<input required class="rounded border p-2" name="color" placeholder="Enter Color" />
	<input required class="rounded border p-2" name="make" placeholder="Enter Make" />
	<input required class="rounded border p-2" name="model" placeholder="Enter Model" />
	<button type="submit" class="rounded border bg-green-400 px-4 py-1 text-center text-white">
		Create Car
	</button>
</form>
