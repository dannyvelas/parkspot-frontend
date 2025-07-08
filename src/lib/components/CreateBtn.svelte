<script lang="ts">
	interface Props {
		// props
		onclick: () => void;
	}

	let { onclick }: Props = $props();
</script>

<div
	class="flex cursor-default flex-row items-center gap-x-2"
	onclick={() => onclick()}
	onkeydown={() => onclick()}
>
	<span class="text-xs text-green-400">Create</span>
	<iconify-icon icon="ph:plus-circle-bold" class="text-green-400"></iconify-icon>
</div>
