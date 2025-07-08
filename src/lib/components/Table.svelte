<script lang="ts">
	import { page } from '$app/state';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { Snippet } from 'svelte';

	// props
	interface Props {
		totalAmount: number;
		search: string;
		pageNum: number;
		headerCells: Snippet;
		rows: Snippet;
	}

	let { totalAmount, search, pageNum, headerCells, rows }: Props = $props();

	// model
	let bannerError = '';

	// helpers
	const pageToHref = (pageNum: number) => {
		const searchParam = search === '' ? '' : `search=${search}&`;
		return `${page.url.pathname}?${searchParam}page=${pageNum}`;
	};
</script>

{#if bannerError != ''}
	<div>
		<p>{bannerError}. Please try again later.</p>
	</div>
{/if}

<div class="flex flex-col gap-2">
	<div
		class="flex flex-row justify-between rounded bg-black px-2 py-3 text-white shadow-md lg:px-8"
	>
		{@render headerCells()}
	</div>
	{@render rows()}
</div>
<Pagination {totalAmount} {pageNum} {pageToHref} />
