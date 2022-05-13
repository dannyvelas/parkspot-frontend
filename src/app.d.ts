/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { Admin } from '$lib/models';

declare global {
	declare namespace App {
		interface Locals {}

		interface Platform {}

		interface Session {
			user?: Admin;
		}

		interface Stuff {}
	}
}
