<script lang="ts">
	import type { Visitor } from '$lib/models';
	import { monthDayYearDate } from '$lib/time';
	import Row from '$lib/components/Row.svelte';

	interface Props {
		userRole: string;
		visitor: Visitor;
		onClickDelete: (visitor: Visitor) => void;
	}

	let { userRole, visitor, onClickDelete }: Props = $props();

	// model
	let fullName = visitor.firstName + ' ' + visitor.lastName;

	// styles
	const twGreenStatus = 'bg-green-200 text-green-500';
	const twRedStatus = 'bg-rose-200 text-rose-500';
	let twRelationColors = $derived(visitor.relationship === 'fam/fri' ? twGreenStatus : twRedStatus);
	let relationText = $derived(visitor.relationship === 'fam/fri' ? 'Friend' : 'Contractor');
</script>

<Row>
	{#snippet cells()}
		<div class="basis-32 text-xs text-zinc-800">{fullName}</div>
		<div class="basis-20 text-xs text-zinc-800">{visitor.residentID}</div>
		<div class="hidden md:flex md:inline md:basis-20 md:flex-row">
			<div class="basis-16 text-xs {twRelationColors} rounded-lg py-0.5 text-center">
				{relationText}
			</div>
		</div>
	{/snippet}
	{#snippet header()}
		<div class="text-xs font-bold">{fullName}</div>
		<div class="text-xs text-gray-500">
			{monthDayYearDate(visitor.accessStart)} - {monthDayYearDate(visitor.accessEnd)}
		</div>
	{/snippet}
	{#snippet bottomContent()}
		<div class="flex flex-row justify-around">
			{#if userRole === 'resident'}
				<button
					class="basis-20 rounded-md border border-rose-500 text-center text-rose-500"
					onclick={() => onClickDelete(visitor)}
				>
					Delete
				</button>
			{/if}
		</div>
	{/snippet}
</Row>
