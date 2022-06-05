<script context="module" lang="ts">
	import type { Load } from './[id]';
	import type { Resident } from '$lib/models';
	import { get } from '$lib/api';
	import { residentDecoder } from '$lib/models';

	export const load: Load = async ({ session, params }) => {
		if (!session.user) {
			return { status: 302, redirect: '/' };
		} else if (session.user.role !== 'admin') {
			return { status: 302, redirect: '/resident' };
		}

		const result = await get(`api/resident/${params.id}`, {}, residentDecoder);

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import type { Result, Status } from '$lib/functional';
	import type { EditResidentArgs } from '$lib/models';
	import { isOk, newOk, newLoading } from '$lib/functional';
	import { put } from '$lib/api';

	// props
	export let result: Result<Resident>;

	// model
	let model: Status<{
		resident: Resident;
		editResidentArgs: EditResidentArgs;
		bannerError: string;
	}> = newLoading;
	if (!isOk(result)) {
		model = result;
	} else {
		model = newOk({
			resident: result.data,
			editResidentArgs: {
				firstName: result.data.firstName,
				lastName: result.data.lastName,
				phone: result.data.phone,
				email: result.data.email
			},
			bannerError: ''
		});
	}

	// events
	const submit = async () => {
		const payload: Partial<EditResidentArgs> = {
			firstName: model.data!.editResidentArgs.firstName || undefined,
			lastName: model.data!.editResidentArgs.lastName || undefined,
			phone: model.data!.editResidentArgs.phone || undefined,
			email: model.data!.editResidentArgs.email || undefined
		};

		const putRes = await put<Partial<EditResidentArgs>, Resident>(
			`api/resident/${model.data!.resident.id}`,
			payload,
			residentDecoder
		);
		if (!isOk(putRes)) {
			model.data!.bannerError = putRes.message;
			return;
		}

		model.data!.resident = putRes.data;
	};
</script>

<svelte:head>
	<title>Edit Resident</title>
</svelte:head>

{#if !isOk(model)}
	<p>Error: {model.message}</p>
{:else}
	<h1>Edit Resident</h1>
	{#if model.data.bannerError != ''}
		<div>
			<p>Error editing resident: {model.data.bannerError}. Please try again later.</p>
		</div>
	{/if}
	<p>Resident Account: {model.data.resident.id}</p>
	<form on:submit|preventDefault={submit}>
		First Name:
		<input
			type="text"
			placeholder={model.data.resident.firstName}
			bind:value={model.data.editResidentArgs.firstName}
		/>
		Last Name:
		<input
			type="text"
			placeholder={model.data.resident.lastName}
			bind:value={model.data.editResidentArgs.lastName}
		/>
		Phone:
		<input
			type="text"
			placeholder={model.data.resident.phone}
			bind:value={model.data.editResidentArgs.phone}
		/>
		Email:
		<input
			type="text"
			placeholder={model.data.resident.email}
			bind:value={model.data.editResidentArgs.email}
		/>
		<button type="submit">Submit</button>
	</form>
{/if}
