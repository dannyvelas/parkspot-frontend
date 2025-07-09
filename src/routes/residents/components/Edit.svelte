<script lang="ts">
	import type { Resident } from '$lib/models';
	import { Request } from '$lib/api';
	import { getLatestToken } from '$lib/auth/jwt';
	import { isOk } from '$lib/functional';
	import { residentDecoder } from '$lib/models';
	import Banner, { updateBanner } from '$lib/components/Banner.svelte';

	interface Props {
		item: Resident;
		onUpdated: (item: Resident) => void;
	}

	let { item, onUpdated }: Props = $props();
	const newItem = $state(structuredClone($state.snapshot(item)));

	// events
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const editRes = await new Request(residentDecoder)
			.setAccessToken(await getLatestToken())
			.put(`api/resident`, newItem);
		if (!isOk(editRes)) {
			updateBanner(true, editRes.message);
			return;
		}

		updateBanner(false, 'Resident updated');

		onUpdated(editRes.data);
	}
</script>

<form class="mx-auto flex w-52 flex-col gap-4 bg-white md:w-64" onsubmit={handleSubmit}>
	<Banner />
	<p class="text-center text-lg font-bold">Edit Resident</p>
	<input class="rounded border p-2 text-gray-500" bind:value={newItem.id} readonly />
	<input
		class="rounded border p-2"
		placeholder="Enter new first name"
		bind:value={newItem.firstName}
	/>
	<input
		class="rounded border p-2"
		placeholder="Enter new last name"
		bind:value={newItem.lastName}
	/>
	<input class="rounded border p-2" placeholder="Enter new phone" bind:value={newItem.phone} />
	<input class="rounded border p-2" placeholder="Enter new email" bind:value={newItem.email} />
	<input
		class="rounded border p-2"
		type="number"
		placeholder="Enter new amount of days used"
		bind:value={newItem.amtParkingDaysUsed}
	/>
	<div class="text-center">
		<label for="unlimDays">Unlimited Days: </label>
		<input id="unlimDays" type="checkbox" bind:checked={newItem.unlimDays} />
	</div>
	<button type="submit" class="rounded border bg-green-400 px-4 py-1 text-center text-white">
		Edit Resident
	</button>
</form>
