<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	type Props = {
		id: string;
	};

	export const load: Load<Record<string, string>, Record<string, any>, Props> = async ({
		session
	}) => {
		if (session.user) {
			return { props: { id: session.user.id } };
		} else {
			return {};
		}
	};
</script>

<script lang="ts">
	export let id: string;
</script>

<h1>Welcome {id}</h1>
<h2>Admin Dashboard</h2>

<p>
	List Active Parking Permits:
	<a href="/permits/active"><button>Submit</button></a>
</p>
<p>
	List All Parking Permits:
	<a href="/permits/all"><button>Submit</button></a>
</p>
<p>
	List Expired Parking Permits:
	<a href="/permits/expired"><button>Submit</button></a>
</p>
<p>
	List Exceptions:
	<a href="/permits/exceptions"><button>Submit</button></a>
</p>
<p>
	List Parking Days Given To Guests by Resident Id:
	<a href="/resident/parking-days"><button>Submit</button></a>
</p>
<p>
	List Resident Accounts:
	<a href="/resident/accounts"><button>Submit</button></a>
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
