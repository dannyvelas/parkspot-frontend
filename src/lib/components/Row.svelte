<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		cells: Snippet;
		header?: Snippet;
		topContent?: Snippet;
		middleContent?: Snippet;
		bottomContent: Snippet;
	}

	let { cells, header, topContent, middleContent, bottomContent }: Props = $props();

	// model
	let isExpanded = $state(false);
</script>

<div class="flex flex-col gap-2 rounded bg-white px-2 py-3 shadow-md lg:px-8">
	<div
		class="flex flex-row justify-between"
		onclick={() => (isExpanded = !isExpanded)}
		onkeypress={() => (isExpanded = !isExpanded)}
	>
		<div class="basis-3 text-xs">
			{#if !isExpanded}
				<iconify-icon icon="material-symbols:keyboard-arrow-down-rounded"></iconify-icon>
			{:else}
				<iconify-icon icon="material-symbols:keyboard-arrow-up-rounded"></iconify-icon>
			{/if}
		</div>
		{@render cells()}
	</div>
	{#if isExpanded}
		<div transition:slide class="flex flex-col gap-y-5">
			<div>
				{#if header}
					{@render header()}
				{/if}
				<hr class="my-3" />
				{#if topContent}
					{@render topContent()}
				{/if}
			</div>
			{#if middleContent}
				{@render middleContent()}
			{/if}
			{@render bottomContent()}
		</div>
	{/if}
</div>
