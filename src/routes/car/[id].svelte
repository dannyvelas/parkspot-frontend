<script context="module" lang="ts">
	import type { Load } from './[id]';
	import type { Car } from '$lib/models';
	import { carDecoder } from '$lib/models';
	import { get } from '$lib/api';

	export const load: Load = async ({ params, session: { user } }) => {
		if (!user) return { status: 302, redirect: '/' };

		const result = await get<Car>(`api/car/${params.id}`, carDecoder);

		return {
			props: {
				result
			}
		};
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import { isOk } from '$lib/functional';
	import LoadedCar from './_LoadedCar.svelte';

	export let result: Result<Car>;
</script>

<svelte:head>
	<title>Edit Car</title>
</svelte:head>

{#if !isOk(result)}
	<p>Error: {result.error}</p>
{:else}
	<LoadedCar car={result.data} />
{/if}
