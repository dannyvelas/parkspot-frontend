<script lang="ts" module>
	export interface Item {
		id: string | number;
	}

	export let openCreate = () => {};
	export let openEdit = (_: any) => {};
	export let openDelete = (_: any) => {};
</script>

<script lang="ts" generics="T extends Item">
	import type { ListWithMetadata, User } from '$lib/models';
	import type { Component } from 'svelte';
	import Modal, { getModal } from '$lib/components/Modal.svelte';

	// props
	interface Props {
		user: User;
		list: ListWithMetadata<T>;
		CreateModal: Component<{ user: User; onCreated: (t: T) => void }>;
		EditModal: Component<{ item: T; onUpdated: (t: T) => void }> | undefined;
		DeleteModal: Component<{ item: T; onDeleted: (t: T) => void }>;
		onModalUpdate: (newList: ListWithMetadata<T>) => void;
	}

	let {
		user,
		list = $bindable(),
		onModalUpdate,
		CreateModal,
		EditModal,
		DeleteModal
	}: Props = $props();

	// model
	let editItem: T | undefined = $state();
	let deleteItem: T | undefined = $state();

	// API: modal open events
	openCreate = () => {
		getModal('create')?.open();
	};
	openEdit = (t: T) => {
		editItem = t;
		getModal('edit')?.open();
	};
	openDelete = (t: T) => {
		deleteItem = t;
		getModal('delete')?.open();
	};

	// modal dispatch events
	const addItem = (item: T) => {
		const newList: ListWithMetadata<T> = {
			records: [item, ...list.records],
			metadata: {
				totalAmount: list.metadata.totalAmount + 1
			}
		};
		getModal('create')?.close();
		onModalUpdate(newList);
	};
	const updateItem = (item: T) => {
		const pIndex = list.records.findIndex((p) => p.id === item.id);
		if (pIndex === -1) {
			onModalUpdate(list);
			return;
		}

		const newList: ListWithMetadata<T> = {
			records: list.records.map((p, i) => (i === pIndex ? item : p)),
			metadata: list.metadata
		};
		onModalUpdate(newList);
	};
	const removeItem = (item: T) => {
		const newList: ListWithMetadata<T> = {
			records: list.records.filter((p) => p.id !== item.id),
			metadata: { totalAmount: list.metadata.totalAmount - 1 }
		};
		getModal('delete')?.close();
		onModalUpdate(newList);
	};
</script>

<Modal id="create">
	<CreateModal {user} onCreated={addItem} />
</Modal>
<Modal id="edit">
	{#if editItem}
		<EditModal item={editItem} onUpdated={updateItem} />
	{/if}
</Modal>
<Modal id="delete">
	{#if deleteItem}
		<DeleteModal item={deleteItem} onDeleted={removeItem} />
	{/if}
</Modal>
