<script lang="ts">
	import type { Result } from '$lib/functional';
	import type { Permit, ListWithMetadata, permitList } from '$lib/models';
	import type { Session } from '$lib/auth';
	import { isOk } from '$lib/functional';
	import { capitalize } from '$lib/strings';
	import Row from './Row.svelte';
	import Search from '$lib/components/Search.svelte';
	import CreateBtn from '$lib/components/CreateBtn.svelte';
	import Table from '$lib/components/Table.svelte';
	import ListModals, { openCreate, openEdit, openDelete } from '$lib/components/ListModals.svelte';
	import Create from './Create.svelte';
	import Edit from './Edit.svelte';
	import Delete from './Delete.svelte';

	interface Props {
		// props
		listName: permitList;
		permits: Result<ListWithMetadata<Permit>>;
		session: Session;
		search: string;
		pageNum: number;
	}

	let { listName, permits, session, search, pageNum }: Props = $props();
	const newPermits = $state(structuredClone(permits));

	function refreshList(newList: ListWithMetadata<Permit>) {
		newPermits.data = newList;
	}
</script>

<header class="mb-4">
	<h1 class="text-base">{capitalize(listName)} Permits</h1>
	<div class="text-xs text-gray-400">{newPermits.data?.metadata.totalAmount || 0} total</div>
</header>

{#if !isOk(newPermits)}
	{newPermits.message}
{:else if isOk(newPermits)}
	<ListModals
		list={newPermits.data}
		user={session.user}
		CreateModal={Create}
		EditModal={Edit}
		DeleteModal={Delete}
		onModalUpdate={refreshList}
	/>
	<div class="mb-4 flex flex-row gap-x-1 md:gap-x-4">
		<Search {search} />
		{#if session.user.role === 'admin' || session.user.role === 'resident'}
			<CreateBtn onclick={openCreate} />
		{/if}
	</div>
	<Table totalAmount={newPermits.data.metadata.totalAmount} {search} {pageNum}>
		{#snippet headerCells()}
			<div class="basis-3 text-xs"></div>
			<div class="hidden text-xs md:inline md:basis-12">ID</div>
			<div class="hidden text-xs md:inline md:basis-20">Resident ID</div>
			<div class="basis-20 text-xs md:basis-1/3">Vehicle</div>
			<div class="basis-20 text-xs">License</div>
			<div class="basis-16 text-xs">Status</div>
		{/snippet}
		{#snippet rows()}
			{#each newPermits.data.records as permit (permit.id)}
				<Row
					{permit}
					userRole={session.user.role}
					onClickDelete={openDelete}
					onClickEdit={openEdit}
				/>
			{/each}
		{/snippet}
	</Table>
{/if}
