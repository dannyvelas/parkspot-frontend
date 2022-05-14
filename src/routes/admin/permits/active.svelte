<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Permit, ListWithMetadata } from '$lib/models';
	import { permitDecoder, listWithMetadataDecoder } from '$lib/models';
	import { get } from '$lib/api';

	export const load: Load = async ({ session: { user } }) => {
		if (!user) return { status: 302, redirect: '/' };

		const result = await get<ListWithMetadata<Permit>>(
			`api/admin/permits/active`,
			listWithMetadataDecoder(permitDecoder)
		);

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
	import PermitsList from './_PermitsList.svelte';

	export let result: Result<ListWithMetadata<Permit>>;
</script>

<svelte:head>
	<title>Active Permits</title>
</svelte:head>

<h1>Active Permits</h1>

{#if !isOk(result)}
	{result.error}
{:else}
	<PermitsList totalAmount={result.data.metadata.totalAmount} permits={result.data.records} />
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
