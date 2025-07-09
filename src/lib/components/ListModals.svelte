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
	import Modal from '$lib/components/Modal.svelte';

	interface Props {
		user: User;
		list: ListWithMetadata<T>;
		CreateModal: Component<{ user: User; onCreated: (t: T) => void }>;
		EditModal: Component<{ item: T; onUpdated: (t: T) => void }> | undefined;
		DeleteModal: Component<{ item: T; onDeleted: (t: T) => void }>;
		onModalUpdate: (newList: ListWithMetadata<T>) => void;
	}

	let { user, list, onModalUpdate, CreateModal, EditModal, DeleteModal }: Props = $props();

	// model
	let editItem: T | undefined = $state();
	let deleteItem: T | undefined = $state();
	let createModal: Modal;
	let editModal: Modal;
	let deleteModal: Modal;

	// API: modal open events
	openCreate = () => {
		createModal.openModal();
	};
	openEdit = (t: T) => {
		editItem = t;
		editModal.openModal();
	};
	openDelete = (t: T) => {
		deleteItem = t;
		deleteModal.openModal();
	};

	// modal dispatch events
	const addItem = (item: T) => {
		const newList: ListWithMetadata<T> = {
			records: [item, ...list.records],
			metadata: {
				totalAmount: list.metadata.totalAmount + 1
			}
		};
		createModal.closeModal();
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
		deleteModal.closeModal();
		onModalUpdate(newList);
	};
</script>

<Modal bind:this={createModal}>
	<CreateModal {user} onCreated={addItem} />
</Modal>
<Modal bind:this={editModal}>
	{#if editItem}
		<EditModal item={editItem} onUpdated={updateItem} />
	{/if}
</Modal>
<Modal bind:this={deleteModal}>
	{#if deleteItem}
		<DeleteModal item={deleteItem} onDeleted={removeItem} />
	{/if}
</Modal>
