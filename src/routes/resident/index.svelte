<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (!session.user) return { status: 302, redirect: '/' };

		return {
			props: {
				user: session.user
			}
		};
	};
</script>

<script lang="ts">
	import type { User } from '$lib/models';
	export let user: User;
</script>

<svelte:head>
	<title>Resident Dashboard</title>
</svelte:head>

<h1>Resident Dashboard</h1>

<div>
	<p>
		List Active Parking Permits
		<a href="/resident/{user.id}/permits/active"><button>Submit</button></a>
	</p>
	<p>
		List All Parking Permits:
		<a href="/resident/{user.id}/permits"><button>Submit</button></a>
	</p>

	<hr />

	<p>
		Request a Guest Parking Permit:
		<a href="/permit/request"><button>Submit</button></a>
	</p>
	<p>
		Add a visitor:
		<a href="/resident/{user.id}/visitors"><button>Submit</button></a>
	</p>
</div>

<style>
	h1,
	div {
		text-align: center;
	}
</style>
