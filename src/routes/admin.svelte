<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (!session.user) {
			return { status: 302, redirect: '/' };
		} else if (session.user.role !== 'admin') {
			return { status: 302, redirect: '/resident' };
		}

		return {};
	};
</script>

<p>
	List Active Parking Permits:
	<a href="/permits/active"><button>Submit</button></a>
</p>
<p>
	List All Parking Permits:
	<a href="/permits"><button>Submit</button></a>
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
	<a href="/residents/days"><button>Submit</button></a>
</p>
<p>
	List Resident Accounts:
	<a href="/residents"><button>Submit</button></a>
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
