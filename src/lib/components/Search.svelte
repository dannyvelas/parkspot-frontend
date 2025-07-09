<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	interface Props {
		search: string;
	}

	let { search }: Props = $props();

	// model
	let currSearch = $state(search);

	// events
	const handleSearch = async () => {
		if (currSearch === search) {
			return;
		}

		if (currSearch === '') {
			goto('?');
			return;
		}

		let query = new URLSearchParams(page.url.searchParams);
		query.set('search', currSearch);
		query.delete('page'); // searches will purposely erase the state of the current page number
		goto(`?${query.toString()}`);
	};
</script>

<!-- ref: https://flowbite.com/docs/forms/search-input/-->
<form class="grow" onsubmit={handleSearch}>
	<label class="relative block flex">
		<iconify-icon
			icon="heroicons:magnifying-glass-solid"
			class="absolute inset-y-0 left-0 z-0 flex items-center pl-2 text-green-400"
		></iconify-icon>
		<input
			class="grow rounded-2xl border border-slate-300 bg-white py-2 pl-7 text-xs placeholder:text-xs placeholder:text-slate-400 focus:outline-none"
			placeholder="Search"
			type="text"
			name="search"
			maxlength="100"
			bind:value={currSearch}
		/>
		<input
			class="absolute inset-y-1 right-1 z-0 rounded-2xl bg-green-400 px-6 text-xs text-white"
			type="submit"
			value="Go"
		/>
	</label>
</form>
