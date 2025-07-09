<script lang="ts" module>
	export let updateBanner = (_: boolean, __: string) => {};
	export let clearBanner = () => {};
</script>

<script lang="ts">
	let isError = $state(false);
	let message = $state('');

	// api
	updateBanner = (b: boolean, s: string) => {
		isError = b;
		message = s;
	};
	clearBanner = () => {
		message = '';
	};

	// styles
	let colors = $derived(isError ? 'bg-rose-200 border-rose-500' : 'bg-green-200 border-green-500');
</script>

{#if message != ''}
	<div class="min-w-full {colors} rounded-md border p-2">
		<p class="text-sm">{message}</p>
	</div>
{/if}
