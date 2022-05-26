<script lang="ts">
	import PermitsList from './_PermitsList.svelte';
</script>

<PermitsList
	listType="expired"
	endpoint="api/permits/expired"
	pageNumCb={(a) => `/permits/expired?page=${a}`}
	reversed={false}
/>
