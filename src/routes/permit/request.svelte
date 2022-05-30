<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (!session.user) return { status: 302, redirect: '/' };

		return {};
	};
</script>

<script lang="ts">
	import type { NewPermitReq } from '$lib/models';
	import { onMount } from 'svelte';
	import { permitDecoder } from '$lib/models';
	import { isOk } from '$lib/functional';
	import { goto } from '$app/navigation';
	import { post } from '$lib/api';
	import { Litepicker } from 'litepicker';

	// helpers
	const dateToday = new Date();
	const dateTomorrow = (() => {
		const tempDate = new Date();
		tempDate.setDate(dateToday.getDate() + 1);
		return tempDate;
	})();

	// model
	const fields: NewPermitReq = {
		residentId: '',
		car: {
			licensePlate: '',
			color: '',
			make: '',
			model: ''
		},
		startDate: dateToday.toISOString(),
		endDate: dateTomorrow.toISOString(),
		exceptionReason: ''
	};
	let bannerError = '';
	let isException = false;

	onMount(() => {
		const litepicker = new Litepicker({
			element: document.getElementById('litepicker') as HTMLElement,
			minDays: 2,
			minDate: Date.now() - 15 * 24 * 60 * 60 * 1000,
			singleMode: false,
			format: 'MM-DD-YYYY'
		});
		litepicker.setStartDate(dateToday);
		litepicker.setEndDate(dateTomorrow);

		litepicker.on(
			'selected',
			(
				date1: import('litepicker/dist/types/datetime').DateTime,
				date2: import('litepicker/dist/types/datetime').DateTime
			) => {
				fields.startDate = date1.toJSDate().toISOString();
				fields.endDate = date2.toJSDate().toISOString();
			}
		);
	});

	// events
	const submit = async () => {
		const result = await post('api/permit', fields, permitDecoder);
		if (!isOk(result)) {
			bannerError = result.message;
			return;
		}
		goto(`/permit/${result.data.id}`);
	};
</script>

<svelte:head>
	<title>New Permit</title>
</svelte:head>

{#if bannerError != ''}
	<div>
		<p>Error creating permit: {bannerError}. Please try again later.</p>
	</div>
{/if}
<form on:submit|preventDefault={submit}>
	<input required type="text" placeholder="Resident ID" bind:value={fields.residentId} />
	<input required type="text" placeholder="License Plate" bind:value={fields.car.licensePlate} />
	<input required type="text" placeholder="Color" bind:value={fields.car.color} />
	<input required type="text" placeholder="Make" bind:value={fields.car.make} />
	<input required type="text" placeholder="Model" bind:value={fields.car.model} />
	<input required type="text" placeholder="Choose Dates" id="litepicker" />
	<div style="margin:20px;">
		<label for="exception">Exception: </label>
		<input type="checkbox" bind:checked={isException} />
	</div>
	{#if isException}
		<textarea
			bind:value={fields.exceptionReason}
			placeholder="Reason for exception"
			rows="5"
			cols="30"
		/>
	{/if}
	<button type="submit" style="margin:10px;">Submit</button>
</form>

<style>
	form {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	input[type='text'] {
		padding: 12px 20px;
		margin: 8px 0;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
</style>
