<script lang="ts" module>
	export let getStartDate = (): Date => new Date();
	export let getEndDate = (): Date => new Date();
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getStartOfToday, getEndOfTomorrow } from '$lib/time';

	// props
	let startDate = getStartOfToday();
	let endDate = getEndOfTomorrow();

	// API
	getStartDate = () => startDate;
	getEndDate = () => endDate;

	// lifecycle
	onMount(async () => {
		const { Litepicker } = await import('litepicker');
		const litepicker = new Litepicker({
			element: document.getElementById('litepicker') as HTMLElement,
			minDays: 2,
			minDate: startDate,
			singleMode: false,
			format: 'MM-DD-YYYY'
		});
		litepicker.setStartDate(startDate);
		litepicker.setEndDate(endDate);

		litepicker.on('selected', (date1, date2) => {
			startDate = date1.toJSDate();

			date2.setHours(23, 59, 59); // for entirety of date2
			endDate = date2.toJSDate();
		});
	});

	onDestroy(() => {
		const lpElements = document.getElementsByClassName('litepicker');
		for (let i = 0; i < lpElements.length; i++) {
			lpElements[i].remove();
		}
	});
</script>

<input readonly id="litepicker" class="rounded border p-2 text-center" />
