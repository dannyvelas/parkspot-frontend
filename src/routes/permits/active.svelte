<script lang="ts">
	import PermitsList from './_PermitsList.svelte';
</script>

<PermitsList
	listType="active"
	endpoint="api/permits/active"
	pageNumCb={(a) => `/permits/active?page=${a}`}
	reversed={false}
/>
