<script lang="ts">
	import type { PageData } from './$types';
	import Page from '../components/Page.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<Page
	listName="active"
	permits={data.permits}
	session={data.session}
	search={data.search}
	pageNum={data.pageNum}
/>
