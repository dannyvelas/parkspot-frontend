<script lang="ts">
	import type { PageData } from './$types';
	import { capitalize } from '$lib/strings';
	import { initDictionary, _, locale } from '$lib/i18n';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const capitalRole = capitalize(data.session.user.role);

	initDictionary('es');
</script>

<svelte:head>
	<title>{capitalRole} Dashboard</title>
</svelte:head>

<select class="rounded border border-black" bind:value={$locale}>
	<option value="es">Español</option>
	<option value="en">English</option>
</select>

<h1 class="my-6 text-xl">{$_('title')}</h1>

<p class="mb-3">{$_('subtitle')}</p>

<h2 class="font-bold">{$_('listName')}</h2>
<ul class="m-4 list-disc">
	<li>{$_('l0')}</li>
	<li>{$_('l1')}</li>
	<li>{$_('l2')}</li>
	<li>{$_('l3')}</li>
</ul>

<h2 class="font-bold">{$_('rulesName')}</h2>
<ul class="m-4 list-disc">
	<li>{$_('rule0')}</li>
	<li>{$_('rule1')}</li>
	<li>{$_('rule2')}</li>
	<li>{$_('rule3')}</li>
</ul>
