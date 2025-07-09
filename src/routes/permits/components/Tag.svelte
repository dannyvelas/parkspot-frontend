<script lang="ts">
	interface Props {
		startDate: Date;
		endDate: Date;
	}

	let { startDate, endDate }: Props = $props();

	// model
	const now = new Date().getTime();
	const tag =
		endDate.getTime() < now
			? { title: 'Expired', color: 'bg-rose-200 text-rose-500' }
			: startDate.getTime() > now
				? { title: 'Future', color: 'bg-gray-300 text-gray-500' }
				: { title: 'Active', color: 'bg-green-200 text-green-500' };
</script>

<div class="{tag.color} basis-16 rounded-lg py-0.5 text-center text-xs">
	{tag.title}
</div>
