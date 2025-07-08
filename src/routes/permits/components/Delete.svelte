<script lang="ts">
	import type { Permit } from '$lib/models';
	import { Request } from '$lib/api';
	import { getLatestToken } from '$lib/auth/jwt';
	import { isOk } from '$lib/functional';
	import Banner, { updateBanner } from '$lib/components/Banner.svelte';

	interface Props {
		item: Permit;
		onDeleted: (item: Permit) => void;
	}
	let { item, onDeleted }: Props = $props();

	// events
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const delRes = await new Request()
			.setAccessToken(await getLatestToken())
			.delete(`api/permit/${item.id}`);
		if (!isOk(delRes)) {
			updateBanner(true, delRes.message);
			return;
		}

		onDeleted(item);
	}
</script>

<form class="mx-auto flex w-52 flex-col gap-4 bg-white md:w-64" onsubmit={handleSubmit}>
	<Banner />
	<p class="text-center">Delete the following permit?</p>
	<table>
		<tbody>
			<tr>
				<td class="font-bold">ID</td><td>{item.id}</td>
			</tr>
			<tr>
				<td class="font-bold">Resident ID</td><td>{item.residentID}</td>
			</tr>
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
				<td class="font-bold">Model</td><td>{item.model}</td>
			</tr>
		</tbody>
	</table>
	<button type="submit" class="rounded border bg-rose-400 px-4 py-1 text-center text-white">
		Delete Permit
	</button>
</form>
