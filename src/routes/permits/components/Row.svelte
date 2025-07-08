<script lang="ts">
	import type { Permit } from '$lib/models';
	import { capitalize } from '$lib/strings';
	import { minimalDate, detailDate } from '$lib/time';
	import Row from '$lib/components/Row.svelte';
	import Tag from './Tag.svelte';

	interface Props {
		// props
		permit: Permit;
		userRole: string;
		onClickEdit: (permit: Permit) => void;
		onClickDelete: (permit: Permit) => void;
	}

	let { permit, userRole, onClickEdit, onClickDelete }: Props = $props();
</script>

<Row>
	{#snippet cells()}
		<div class="hidden text-xs text-zinc-800 md:inline md:basis-12">{permit.id}</div>
		<div class="hidden text-xs text-zinc-800 md:inline md:basis-20">{permit.residentID}</div>
		<div class="basis-20 text-xs text-zinc-800 md:basis-1/3">
			<span class="hidden lg:inline">{capitalize(permit.color)}</span>
			<span>{capitalize(permit.make)}</span>
			<span class="hidden lg:inline">{capitalize(permit.model)}</span>
		</div>
		<div class="basis-20 text-xs text-zinc-800">{permit.licensePlate}</div>
		<Tag startDate={permit.startDate} endDate={permit.endDate} />
	{/snippet}
	{#snippet header()}
		<div class="text-xs font-bold">Permit {permit.id}</div>
		<div class="text-xs text-gray-500">
			{minimalDate(permit.startDate)} - {minimalDate(permit.endDate)}
		</div>
	{/snippet}
	{#snippet topContent()}
		<div class="flex flex-row">
			<div class="flex basis-1/2 flex-col gap-1 truncate">
				<div class="mb-2 text-xs font-bold text-gray-500">Resident</div>
				<div class="truncate text-xs">{permit.residentID}</div>
			</div>
			<div class="flex basis-1/2 flex-col gap-1 truncate">
				<div class="mb-2 truncate text-xs font-bold text-gray-500">Vehicle</div>
				<div class="truncate text-xs text-black">
					{capitalize(permit.color)}
					{capitalize(permit.make)}
				</div>
				<div class="truncate text-xs text-gray-500">{capitalize(permit.model)}</div>
				<div class="truncate text-xs text-gray-500">{permit.licensePlate}</div>
			</div>
		</div>
	{/snippet}
	{#snippet middleContent()}
		<div class:hidden={!permit.exceptionReason}>
			<div class="mb-2 text-xs font-bold text-gray-500">Exception Reason</div>
			<div class="text-xs">{permit.exceptionReason}</div>
		</div>
	{/snippet}
	{#snippet bottomContent()}
		<div class="text-xs font-bold text-gray-500">Requested Date</div>
		<div class="text-xs">
			{detailDate(new Date(permit.requestTS * 1000))}
		</div>
		<hr class="my-3" />
		<div class="flex flex-row justify-around">
			<a
				class="basis-20 rounded-md border border-sky-500 text-center text-sky-500"
				href="/permit/{permit.id}"
			>
				Reprint
			</a>
			{#if userRole === 'admin'}
				<button
					class="basis-20 rounded-md border border-green-500 text-center text-green-500"
					onclick={() => onClickEdit(permit)}
				>
					Edit
				</button>
				<button
					class="basis-20 rounded-md border border-rose-500 text-center text-rose-500"
					onclick={() => onClickDelete(permit)}
				>
					Delete
				</button>
			{/if}
		</div>
	{/snippet}
</Row>
