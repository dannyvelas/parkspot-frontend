<script lang="ts">
	import type { Resident } from '$lib/models';
	import Row from '$lib/components/Row.svelte';

	interface Props {
		resident: Resident;
		onClickEdit: (resident: Resident) => void;
		onClickDelete: (resident: Resident) => void;
	}

	let { resident, onClickEdit, onClickDelete }: Props = $props();

	// model
	let fullName = $derived(resident.firstName + ' ' + resident.lastName);

	// styles
	const twGreenStatus = 'bg-green-200 text-green-500';
	const twRedStatus = 'bg-rose-200 text-rose-500';
	let twPermissionColors = $derived(resident.unlimDays ? twGreenStatus : twRedStatus);
	let permissionText = $derived(resident.unlimDays ? 'Unlimited' : 'Limited');
</script>

<Row>
	{#snippet cells()}
		<div class="basis-20 text-xs text-zinc-800">{resident.id}</div>
		<div class="basis-32 text-xs text-zinc-800">{fullName}</div>
		<div class="hidden lg:flex lg:inline lg:basis-24 lg:flex-row">
			<span class="basis-16 text-xs {twPermissionColors} rounded-lg py-0.5 text-center">
				{permissionText}
			</span>
		</div>
		<div class="basis-8 text-xs text-zinc-800">{resident.amtParkingDaysUsed}</div>
	{/snippet}
	{#snippet header()}
		<div class="text-xs font-bold">{fullName}</div>
		<div class="text-xs text-gray-500">{resident.phone}</div>
		<div class="text-xs text-gray-500">{resident.email}</div>
	{/snippet}
	{#snippet bottomContent()}
		<div class="flex flex-row justify-around">
			<button
				class="basis-20 rounded-md border border-green-500 text-center text-green-500"
				onclick={() => onClickEdit(resident)}
			>
				Edit
			</button>
			<button
				class="basis-20 rounded-md border border-rose-500 text-center text-rose-500"
				onclick={() => onClickDelete(resident)}
			>
				Delete
			</button>
		</div>
	{/snippet}
</Row>
