<script lang="ts">
	import type { Car } from '$lib/models';
	import { Request } from '$lib/api';
	import { getLatestToken } from '$lib/auth/jwt';
	import { isOk } from '$lib/functional';
	import { carDecoder } from '$lib/models';
	import Banner, { updateBanner } from '$lib/components/Banner.svelte';

	interface Props {
		item: Car;
		onUpdated: (item: Car) => void;
	}

	let { item, onUpdated }: Props = $props();
	const newItem = $state(item);

	// events
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const editRes = await new Request(carDecoder)
			.setAccessToken(await getLatestToken())
			.put(`api/car`, newItem);
		if (!isOk(editRes)) {
			updateBanner(true, editRes.message);
			return;
		}

		updateBanner(false, 'Car updated');

		onUpdated(editRes.data);
	}
</script>

<form class="mx-auto flex w-52 flex-col gap-4 bg-white md:w-64" onsubmit={handleSubmit}>
	<Banner />
	<p class="text-center text-lg font-bold">Edit Car</p>
	<input
		class="rounded border p-2"
		placeholder="Enter new license plate"
		bind:value={newItem.licensePlate}
	/>
	<input class="rounded border p-2" placeholder="Enter new color" bind:value={newItem.color} />
	<input class="rounded border p-2" placeholder="Enter new make" bind:value={newItem.make} />
	<input class="rounded border p-2" placeholder="Enter new model" bind:value={newItem.model} />
	<button type="submit" class="rounded border bg-green-400 px-4 py-1 text-center text-white">
		Edit Car
	</button>
</form>
