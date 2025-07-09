<script lang="ts">
	import type { PageData } from './$types';
	import type { Resident, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import Row from './components/Row.svelte';
	import Search from '$lib/components/Search.svelte';
	import CreateBtn from '$lib/components/CreateBtn.svelte';
	import Table from '$lib/components/Table.svelte';
	import ListModals, { openCreate, openEdit, openDelete } from '$lib/components/ListModals.svelte';
	import Create from './components/Create.svelte';
	import Edit from './components/Edit.svelte';
	import Delete from './components/Delete.svelte';

	interface Props {
		// props
		data: PageData;
	}

	let { data }: Props = $props();
	const newResidents = $state(structuredClone(data.residents));

	function refreshList(newList: ListWithMetadata<Resident>) {
		newResidents.data = newList;
	}
</script>

<svelte:head>
	<title>Residents</title>
</svelte:head>

<header class="mb-4">
	<h1 class="text-base">Residents</h1>
	<div class="text-xs text-gray-400">{newResidents.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(newResidents)}
	{newResidents.message}
{:else}
	<ListModals
		list={newResidents.data}
		user={data.session.user}
		CreateModal={Create}
		EditModal={Edit}
		DeleteModal={Delete}
		onModalUpdate={refreshList}
	/>
	<div class="mb-4 flex flex-row gap-x-1 md:gap-x-4">
		<Search search={data.search} />
		<CreateBtn onclick={() => openCreate()} />
	</div>
	<Table
		totalAmount={newResidents.data.metadata.totalAmount}
		search={data.search}
		pageNum={data.pageNum}
	>
		{#snippet headerCells()}
			<div class="basis-3 text-xs"></div>
			<div class="basis-20 text-xs">ID</div>
			<div class="basis-32 text-xs">Name</div>
			<div class="hidden text-xs lg:inline lg:basis-24">Unlimited Days?</div>
			<div class="basis-8 text-xs">Days Used</div>
		{/snippet}
		{#snippet rows()}
			{#each newResidents.data.records as resident (resident.id)}
				<Row {resident} onClickDelete={openDelete} onClickEdit={openEdit} />
			{/each}
		{/snippet}
	</Table>
{/if}
