<script lang="ts">
	import type { Visitor } from '$lib/models';
	import { Request } from '$lib/api';
	import { getLatestToken } from '$lib/auth/jwt';
	import { isOk } from '$lib/functional';
	import { visitorDecoder } from '$lib/models';
	import { getEndOfTime } from '$lib/time';
	import Banner, { updateBanner, clearBanner } from '$lib/components/Banner.svelte';
	import Litepicker, { getStartDate, getEndDate } from '$lib/components/Litepicker.svelte';

	interface Props {
		onCreated: (visitor: Visitor) => void;
	}
	let { onCreated }: Props = $props();

	// model
	let relationship = $state('fam/fri');
	let isForever = $state(false);
	$effect(() => {
		if (relationship === 'contractor') isForever = false;
	});

	// events
	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		formData.set('accessStart', getStartDate().toISOString());
		const endDate = isForever ? getEndOfTime() : getEndDate();
		formData.set('accessEnd', endDate.toISOString());

		const formObject = Object.fromEntries(formData.entries());
		const result = await new Request(visitorDecoder)
			.setAccessToken(await getLatestToken())
			.post('api/visitor', formObject);
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
	<p class="text-center text-lg font-bold">Create Visitor</p>
	<input required class="rounded border p-2" name="firstName" placeholder="Enter First Name" />
	<input required class="rounded border p-2" name="lastName" placeholder="Enter Last Name" />
	<select class="rounded border p-2" name="relationship" bind:value={relationship}>
		<option value="fam/fri">Friend</option>
		<option value="contractor">Contractor</option>
	</select>
	{#if relationship !== 'contractor'}
		<div class="text-center">
			<label for="isForever">Forever:</label>
			<input type="checkbox" name="isForever" id="isForever" bind:checked={isForever} />
		</div>
	{/if}
	{#if !isForever}
		<Litepicker />
	{/if}
	<button type="submit" class="rounded border bg-green-400 px-4 py-1 text-center text-white">
		Create Visitor
	</button>
</form>
