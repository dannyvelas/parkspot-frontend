<script lang="ts">
	import type { Car } from '$lib/models';
	import { capitalize } from '$lib/strings';
	import Row from '$lib/components/Row.svelte';

	interface Props {
		car: Car;
		userRole: string;
		onClickEdit: (car: Car) => void;
		onClickDelete: (car: Car) => void;
	}

	let { car, userRole, onClickEdit, onClickDelete }: Props = $props();
</script>

<Row>
	{#snippet cells()}
		<div class="basis-20 text-xs text-zinc-800">{car.residentID}</div>
		<div class="basis-20 text-xs text-zinc-800">{car.licensePlate}</div>
		<div class="hidden text-xs text-zinc-800 md:inline md:basis-20">{car.color}</div>
		<div class="hidden text-xs text-zinc-800 md:inline md:basis-20">{car.make}</div>
		<div class="hidden text-xs text-zinc-800 md:inline md:basis-20">{car.model}</div>
		<div class="basis-20 text-xs text-zinc-800 md:hidden">
			{capitalize(car.make)}
		</div>
	{/snippet}
	{#snippet topContent()}
		<div class="flex flex-row">
			<div class="flex basis-1/2 flex-col gap-1 truncate">
				<div class="mb-2 text-xs font-bold text-gray-500">Resident</div>
				<div class="truncate text-xs">{car.residentID}</div>
			</div>
			<div class="flex basis-1/2 flex-col gap-1 truncate">
				<div class="mb-2 truncate text-xs font-bold text-gray-500">Vehicle</div>
				<div class="truncate text-xs text-black">
					{capitalize(car.color)}
					{capitalize(car.make)}
					{capitalize(car.model)}
				</div>
				<div class="truncate text-xs text-gray-500">{car.licensePlate}</div>
			</div>
		</div>
	{/snippet}
	{#snippet bottomContent()}
		<div class="flex flex-row justify-around">
			{#if userRole === 'resident' || userRole === 'admin'}
				<button
					class="basis-20 rounded-md border border-green-500 text-center text-green-500"
					onclick={() => onClickEdit(car)}
				>
					Edit
				</button>
				<button
					class="basis-20 rounded-md border border-rose-500 text-center text-rose-500"
					onclick={() => onClickDelete(car)}
				>
					Delete
				</button>
			{/if}
		</div>
	{/snippet}
</Row>
