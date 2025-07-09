<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		form: Record<string, any> | undefined;
	}

	let { form }: Props = $props();
</script>

<h1 class="m-4 text-center font-bold">Reset Password</h1>
{#if form?.response}
	<div style="text-align: center">
		<p>{form.response}</p>
	</div>
{/if}
<form method="POST" class="mx-auto flex w-52 flex-col gap-4 md:w-64" use:enhance>
	<div class="flex flex-col">
		<label for="username">Enter Username:</label>
		<input
			required
			class="grow rounded border p-2"
			id="username"
			name="id"
			placeholder="T8100123"
		/>
	</div>
	<button type="submit" class="rounded border bg-green-400 px-4 py-1 text-center text-white">
		Send Email To Reset Password
	</button>
</form>
