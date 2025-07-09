<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// model
	let visible = $state(false);

	// events
	export function openModal() {
		if (visible) {
			return;
		}
		window.addEventListener('keydown', closeOnEscape);

		//this prevents scrolling of the main window on larger screens
		document.body.style.overflow = 'hidden';

		visible = true;
	}

	export function closeModal() {
		if (!visible) {
			return;
		}

		window.removeEventListener('keydown', closeOnEscape);

		document.body.style.overflow = '';

		visible = false;
	}

	function closeOnEscape(ev: KeyboardEvent) {
		if (ev.key == 'Escape') closeModal();
	}

	// lifecycle
	onDestroy(() => {
		if (browser) {
			window.removeEventListener('keydown', closeOnEscape);
		}
	});
</script>

{#if visible}
	<div
		class="fixed inset-0 z-10 flex items-center justify-center bg-gray-800/25"
		onclick={closeModal}
		onkeypress={closeOnEscape}
	>
		<div
			class="overflow-auto rounded-md bg-white px-4 py-3"
			id="modal-window"
			onclick={(e: Event) => {
				e.stopPropagation();
			}}
			onkeypress={(e: Event) => {
				e.stopPropagation();
			}}
		>
			<button onclick={closeModal}>
				<iconify-icon icon="mingcute:close-line" style="color:#6d6d6d" width="15" height="15"
				></iconify-icon>
			</button>
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	#modal-window {
		max-width: calc(100vw - 20px);
		max-height: calc(100vh - 20px);
	}
</style>
