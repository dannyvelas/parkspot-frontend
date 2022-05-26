<script lang="ts">
	import PermitsList from './_PermitsList.svelte';
</script>

<PermitsList
	listType="all"
	endpoint="api/permits"
	pageNumCb={(a) => `/permits?page=${a}`}
	reversed={true}
/>
