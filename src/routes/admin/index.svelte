<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Admin } from '$lib/models';

	type Props = {
		admin: Admin;
	};
	export const load: Load<Record<string, string>, Record<string, any>, Props> = async ({
		session
	}) => {
		if (session.user) {
			return { props: { admin: session.user } };
		} else {
			return { status: 302, redirect: '/' };
		}
	};
</script>

<script lang="ts">
	export let admin: Admin;
</script>

<h1>Welcome {admin.firstName}</h1>
<h2>Admin Dashboard</h2>

<p>
	List Active Parking Permits:
	<a href="/admin/permits/active"><button>Submit</button></a>
</p>
<p>
	List All Parking Permits:
	<a href="/admin/permits"><button>Submit</button></a>
</p>
<p>
	List Expired Parking Permits:
	<a href="/admin/permits/expired"><button>Submit</button></a>
</p>
<p>
	List Exceptions:
	<a href="/admin/permits/exceptions"><button>Submit</button></a>
</p>
<p>
	List Parking Days Given To Guests by Resident Id:
	<a href="/admin/residents/days"><button>Submit</button></a>
</p>
<p>
	List Resident Accounts:
	<a href="/admin/residents"><button>Submit</button></a>
</p>
<p>
	List Visitors:
	<a href="/visitors"><button>Submit</button></a>
</p>
<hr />
<p>
	Request a Guest Parking Permit for Resident:
	<a href="/permit/request"><button>Submit</button></a>
</p>
