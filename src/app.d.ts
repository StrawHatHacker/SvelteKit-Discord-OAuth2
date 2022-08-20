/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		session: {
			id: string
		}
	}
	interface PrivateEnv {	}
	interface PublicEnv {
		PUBLIC_DISCORD_REDIRECT_URI: string
	}
	
	// interface Platform {}
}
