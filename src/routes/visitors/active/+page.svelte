<script lang="ts">
	import type { PageData } from './$types';
	import type { Visitor, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import Row from './components/Row.svelte';
	import Search from '$lib/components/Search.svelte';
	import CreateBtn from '$lib/components/CreateBtn.svelte';
	import Table from '$lib/components/Table.svelte';
	import ListModals, { openCreate, openDelete } from '$lib/components/ListModals.svelte';
	import Create from './components/Create.svelte';
	import Delete from './components/Delete.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const newVisitors = $derived(structuredClone(data.visitors));

	function refreshList(newList: ListWithMetadata<Visitor>) {
		newVisitors.data = newList;
	}
</script>

<svelte:head>
	<title>Visitors</title>
</svelte:head>

<header class="mb-4">
	<h1 class="text-base">Visitors</h1>
	<div class="text-xs text-gray-400">{newVisitors.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(newVisitors)}
	{newVisitors.message}
{:else}
	<ListModals
		list={newVisitors.data}
		user={data.session.user}
		CreateModal={Create}
		EditModal={undefined}
		DeleteModal={Delete}
		onModalUpdate={refreshList}
	/>
	<div class="mb-4 flex flex-row gap-x-1 md:gap-x-4">
		<Search search={data.search} />
		{#if data.session.user.role === 'resident'}
			<CreateBtn onclick={() => openCreate()} />
		{/if}
	</div>
	<Table
		totalAmount={newVisitors.data.metadata.totalAmount}
		search={data.search}
		pageNum={data.pageNum}
	>
		{#snippet headerCells()}
			<div class="basis-3 text-xs"></div>
			<div class="basis-32 text-xs">Name</div>
			<div class="basis-20 text-xs">Resident ID</div>
			<div class="hidden text-xs md:inline md:basis-20">Relation</div>
		{/snippet}
		{#snippet rows()}
			{#each newVisitors.data.records as visitor (visitor.id)}
				<Row {visitor} userRole={data.session.user.role} onClickDelete={openDelete} />
			{/each}
		{/snippet}
	</Table>
{/if}
