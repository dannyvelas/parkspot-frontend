<script lang="ts">
	import type { PageData } from './$types';
	import type { Car, ListWithMetadata } from '$lib/models';
	import { isOk } from '$lib/functional';
	import Row from './components/Row.svelte';
	import Search from '$lib/components/Search.svelte';
	import CreateBtn from '$lib/components/CreateBtn.svelte';
	import Table from '$lib/components/Table.svelte';
	import ListModals, { openCreate, openDelete, openEdit } from '$lib/components/ListModals.svelte';
	import Create from './components/Create.svelte';
	import Delete from './components/Delete.svelte';
	import Edit from './components/Edit.svelte';

	interface Props {
		// props
		data: PageData;
	}

	let { data }: Props = $props();
	const newCars = $state(structuredClone(data.cars));

	function refreshList(newList: ListWithMetadata<Car>) {
		newCars.data = newList;
	}
</script>

<svelte:head>
	<title>Cars</title>
</svelte:head>

<header class="mb-4">
	<h1 class="text-base">Cars</h1>
	<div class="text-xs text-gray-400">{newCars.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(newCars)}
	{newCars.message}
{:else}
	<ListModals
		list={newCars.data}
		user={data.session.user}
		CreateModal={Create}
		EditModal={Edit}
		DeleteModal={Delete}
		onModalUpdate={refreshList}
	/>
	<div class="mb-4 flex flex-row gap-x-1 md:gap-x-4">
		<Search search={data.search} />
		{#if data.session.user.role === 'admin' || data.session.user.role === 'resident'}
			<CreateBtn onclick={() => openCreate()} />
		{/if}
	</div>
	<Table
		totalAmount={newCars.data.metadata.totalAmount}
		search={data.search}
		pageNum={data.pageNum}
	>
		{#snippet headerCells()}
			<div class="basis-3 text-xs"></div>
			<div class="basis-20 text-xs">Resident ID</div>
			<div class="basis-20 text-xs">License</div>
			<div class="hidden text-xs md:inline md:basis-20">Color</div>
			<div class="hidden text-xs md:inline md:basis-20">Make</div>
			<div class="hidden text-xs md:inline md:basis-20">Model</div>
			<div class="basis-20 text-xs md:hidden">Vehicle</div>
		{/snippet}
		{#snippet rows()}
			{#each newCars.data.records as car (car.id)}
				<Row
					{car}
					userRole={data.session.user.role}
					onClickDelete={openDelete}
					onClickEdit={openEdit}
				/>
			{/each}
		{/snippet}
	</Table>
{/if}
