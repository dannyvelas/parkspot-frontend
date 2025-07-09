<script lang="ts">
	import type { Car } from '$lib/models';
	import { Request } from '$lib/api';
	import { getLatestToken } from '$lib/auth/jwt';
	import { isOk } from '$lib/functional';
	import Banner, { updateBanner } from '$lib/components/Banner.svelte';

	interface Props {
		item: Car;
		onDeleted: (item: Car) => void;
	}
	let { item, onDeleted }: Props = $props();

	// events
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const delRes = await new Request()
			.setAccessToken(await getLatestToken())
			.delete(`api/car/${item.id}`);
		if (!isOk(delRes)) {
			updateBanner(true, delRes.message);
			return;
		}

		onDeleted(item);
	}
</script>

<form class="mx-auto flex w-52 flex-col gap-4 bg-white md:w-64" onsubmit={handleSubmit}>
	<Banner />
	<p class="text-center">Delete the following car?</p>
	<table>
		<tbody>
			<tr>
				<td class="font-bold">License Plate</td><td>{item.licensePlate}</td>
			</tr>
			<tr>
				<td class="font-bold">Color</td><td>{item.color}</td>
			</tr>
			<tr>
				<td class="font-bold">Make</td><td>{item.make}</td>
			</tr>
			<tr>
				<td class="font-bold">model</td><td>{item.model}</td>
			</tr>
		</tbody>
	</table>
	<button type="submit" class="rounded border bg-rose-400 px-4 py-1 text-center text-white">
		Delete Car
	</button>
</form>
