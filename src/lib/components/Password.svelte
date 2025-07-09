<script lang="ts">
	interface Props {
		name: string;
		placeholder: string;
	}

	let { name, placeholder }: Props = $props();

	// model
	let passwordsShown = $state(false);
	let passwordType = $derived(passwordsShown ? 'text' : 'password');
	let icon = $derived(passwordsShown ? 'mdi:eye' : 'mdi:eye-off');

	// events
	function toggleType() {
		passwordsShown = !passwordsShown;
	}
</script>

<div class="flex">
	<input
		required
		type={passwordType}
		class="grow rounded-l border border-r-0 p-2"
		{name}
		{placeholder}
	/>
	<button
		aria-label="hide-password"
		type="button"
		class="flex items-center rounded-r border px-2"
		onclick={toggleType}
	>
		<iconify-icon {icon}></iconify-icon>
	</button>
</div>
