<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { listWithMetadataDecoder, permitDecoder } from '$lib/models';
	import { DEFAULT_AMT_PER_PAGE } from '$lib/constants';
	import { get } from '$lib/api';

	const limit = DEFAULT_AMT_PER_PAGE;

	export const load: Load = async (loadInput) => {
		if (!loadInput.session.user) return { status: 302, redirect: '/' };

		const currPageNum = Number(loadInput.url.searchParams.get('page')) || 1;
		const params = {
			reversed: 'false',
			limit: `${limit}`,
			page: `${currPageNum}`
		};

		const result = await get('api/permits/expired', params, listWithMetadataDecoder(permitDecoder));

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
	<title>Expired Permits</title>
</svelte:head>

<h1>Expired Permits</h1>

{#if !isOk(result)}
	{result.message}
{:else}
	<PermitsList
		listType="expired"
		permits={result.data.records}
		totalAmount={result.data.metadata.totalAmount}
		pageToHref={(pageNum) => `/permits/expired?page=${pageNum}`}
		{currPageNum}
		{limit}
	/>
{/if}

<style>
	h1 {
		text-align: center;
	}
</style>
