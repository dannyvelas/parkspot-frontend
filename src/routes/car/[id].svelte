<script context="module" lang="ts">
	import type { Load } from './[id]';
	import type { Car } from '$lib/models';
	import { carDecoder } from '$lib/models';
	import { getLoadFn } from '$lib/loadFn';

	export const load: Load = async (args) => {
		const loadFn = getLoadFn(`api/car/${args.params.id}`, carDecoder);
		return loadFn(args);
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
