<script lang="ts">
	import { Request } from '$lib/api';
	import { getLatestToken } from '$lib/auth/jwt';
	import { isOk } from '$lib/functional';
	import { residentDecoder } from '$lib/models';
	import Banner, { updateBanner, clearBanner } from '$lib/components/Banner.svelte';
	import Password from '$lib/components/Password.svelte';
	import type { Resident } from '$lib/models';

	interface Props {
		onCreated: (resident: Resident) => void;
	}

	let { onCreated }: Props = $props();

	// events
	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const formObject = Object.fromEntries(formData.entries());
		const result = await new Request(residentDecoder)
			.setAccessToken(await getLatestToken())
			.post('api/resident', formObject);
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
	<p class="text-center text-lg font-bold">Create Resident</p>
	<input required class="rounded border p-2" name="id" placeholder="Enter Resident ID" />
	<input required class="rounded border p-2" name="firstName" placeholder="Enter First Name" />
	<input required class="rounded border p-2" name="lastName" placeholder="Enter Last Name" />
	<input required class="rounded border p-2" name="phone" placeholder="Enter Phone" />
	<input required class="rounded border p-2" name="email" placeholder="Enter Email" />
	<Password name="password" placeholder="Enter Password" />
	<Password name="confirmPassword" placeholder="Confirm Password" />
	<button type="submit" class="rounded border bg-green-400 px-4 py-1 text-center text-white">
		Create Resident
	</button>
</form>
