/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { User } from "$lib/models";

declare global {
  declare namespace App {
    interface Locals {
      user?: User;
    }

    interface Platform {}

    interface Session {
      user?: User;
    }

    interface Stuff {}
  }
}
