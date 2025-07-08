<script lang="ts">
	import type { Visitor } from '$lib/models';
	import { Request } from '$lib/api';
	import { getLatestToken } from '$lib/auth/jwt';
	import { isOk } from '$lib/functional';
	import { monthDayYearDate } from '$lib/time';
	import Banner, { updateBanner } from '$lib/components/Banner.svelte';

	interface Props {
		item: Visitor;
		onDeleted: (item: Visitor) => void;
	}
	let { item, onDeleted }: Props = $props();

	// events
	async function handleSubmit() {
		const delRes = await new Request()
			.setAccessToken(await getLatestToken())
			.delete(`api/visitor/${item.id}`);
		if (!isOk(delRes)) {
			updateBanner(true, delRes.message);
			return;
		}

		onDeleted(item);
	}
</script>

<form class="mx-auto flex w-52 flex-col gap-4 bg-white md:w-64" onsubmit={handleSubmit}>
	<Banner />
	<p class="text-center">Delete the following visitor?</p>
	<table>
		<tbody>
			<tr>
				<td class="font-bold">First</td><td>{item.firstName}</td>
			</tr>
			<tr>
				<td class="font-bold">Last</td><td>{item.lastName}</td>
			</tr>
			<tr>
				<td class="font-bold">Access Start</td><td>{monthDayYearDate(item.accessStart)}</td>
			</tr>
			<tr>
				<td class="font-bold">Access End</td><td>{monthDayYearDate(item.accessEnd)}</td>
			</tr>
		</tbody>
	</table>
	<button type="submit" class="rounded border bg-rose-400 px-4 py-1 text-center text-white">
		Delete Visitor
	</button>
</form>
