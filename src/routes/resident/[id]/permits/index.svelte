<script context="module" lang="ts">
	import { DEFAULT_AMT_PER_PAGE } from '$lib/constants';
	import { permitDecoder } from '$lib/models';
	import loadList from '$lib/loadList';
	import type { Load } from '@sveltejs/kit';

	const limit = DEFAULT_AMT_PER_PAGE;

	export const load: Load = async (args) => {
		const residentId = args.params.id;
		const out = await loadList(
			`api/resident/${residentId}/permits`,
			permitDecoder,
			limit,
			false,
			'resident'
		)(args);
		return {
			props: {
				residentId,
				...out.props
			}
		};
	};
</script>

<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { Permit, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import PermitsList from '$lib/_PermitsList.svelte';

	export let result: Result<ListWithMetadata<Permit>>;
	export let currPageNum: number;
	export let residentId: string;
</script>

<svelte:head>
	<title>All Permits</title>
</svelte:head>

<h1>All Permits</h1>

{#if !isOk(result)}
	{result.message}
{:else}
	<div class="stack-container">
		<PermitsList
			listType="all"
			permits={result.data.records}
			totalAmount={result.data.metadata.totalAmount}
			pageToHref={(pageNum) => `/resident/${residentId}/permits?page=${pageNum}`}
			{currPageNum}
			{limit}
		/>
	</div>
{/if}

<style>
	h1 {
		text-align: center;
	}

	.stack-container {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
