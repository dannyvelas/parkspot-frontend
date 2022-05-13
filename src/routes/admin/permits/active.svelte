<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Permit } from '$lib/models';
	import { permitDecoder } from '$lib/models';
	import { array } from 'decoders';
	import { get } from '$lib/api';

	export const load: Load = async ({ session: { user } }) => {
		if (!user) return { status: 302, redirect: '/' };

		const permits = await get<Array<Permit>>(`api/admin/permits/active`, array(permitDecoder));

		return {
			props: {
				permits
			}
		};
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import { isOk } from '$lib/functional';
	import PermitsList from './_PermitsList.svelte';

	export let permits: Result<Array<Permit>>;
</script>

<svelte:head>
	<title>Active Permits</title>
</svelte:head>

<h1>Active Permits</h1>

{#if !isOk(permits)}
	{permits.error}
{:else}
	<PermitsList permits={permits.data} />
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
