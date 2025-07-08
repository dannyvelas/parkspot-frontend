<script lang="ts">
	import type { PageData } from './$types';
	import { messageDecoder } from '$lib/models';
	import { isOk } from '$lib/functional';
	import { Request } from '$lib/api';
	import Password from '$lib/components/Password.svelte';
	import Banner, { updateBanner } from '$lib/components/Banner.svelte';

	interface Props {
		// props
		data: PageData;
	}

	let { data }: Props = $props();

	// events
	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const formObject = Object.fromEntries(formData.entries());

		const putRes = await new Request(messageDecoder)
			.setAccessToken(data.accessToken)
			.put(`api/user/password`, formObject);
		if (!isOk(putRes)) {
			updateBanner(
				true,
				'Error: it seems like this link has expired. Please go back to the forgot password' +
					' page for a new reset password email.'
			);
			return;
		}

		updateBanner(
			false,
			'Success! Your password has been reset. You can try logging in now with the new password.'
		);
	}
</script>

<Banner />
<h1 class="m-4 text-center font-bold">Enter Your New Password</h1>
<form class="mx-auto flex w-52 flex-col gap-4 md:w-64" onsubmit={handleSubmit}>
	<Password name="password" placeholder="New Password" />
	<Password name="confirmPassword" placeholder="Confirm Password" />
	<button type="submit" class="rounded border bg-green-400 px-4 py-1 text-center text-white">
		Reset Password
	</button>
</form>
