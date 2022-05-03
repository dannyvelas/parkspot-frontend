/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { Admin } from '$lib/models';

declare namespace App {
	interface Locals {
		user?: Admin;
		//driver: Driver;
		//secrets: Secrets;
	}

	interface Platform {}

	interface Session {
		user?: Admin;
	}

	interface Stuff {}
}
