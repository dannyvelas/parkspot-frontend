<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { listWithMetadataDecoder, permitDecoder } from '$lib/models';
	import { get } from '$lib/api';

	const limit = 1000;

	export const load: Load = async (loadInput) => {
		if (!loadInput.session.user) return { status: 302, redirect: '/' };

		const currPageNum = Number(loadInput.url.searchParams.get('page')) || 1;
		const params = {
			reversed: 'false',
			limit: `${limit}`,
			page: `${currPageNum}`
		};

		const result = await get(
			'api/permits/exceptions',
			params,
			listWithMetadataDecoder(permitDecoder)
		);

		return {
			props: {
				result,
				currPageNum
			}
		};
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { Permit, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import PermitsList from './_PermitsList.svelte';

	export let result: Result<ListWithMetadata<Permit>>;
	export let currPageNum: number;
</script>

<svelte:head>
	<title>Exceptions</title>
</svelte:head>

<h1>Exceptions</h1>

{#if !isOk(result)}
	{result.message}
{:else}
	<PermitsList
		listType="exceptions"
		permits={result.data.records}
		totalAmount={result.data.metadata.totalAmount}
		pageToHref={(pageNum) => `/permits/exceptions?page=${pageNum}`}
		{currPageNum}
		{limit}
	/>
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
