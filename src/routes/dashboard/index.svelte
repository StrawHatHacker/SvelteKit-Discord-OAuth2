<script context="module" lang="ts">
	import type { IUserData } from 'src/interfaces';

	export async function load({ stuff }) {
		return {
			props: { User: stuff }
		};
	}
</script>

<script lang="ts">
	export let User: IUserData;

	async function logout() {
		await fetch('/api/v1/user/logout', {
			method: 'POST',
			body: JSON.stringify({})
		});

		window.location.href = '/';
	}
</script>

<p>User's Discord ID: {User.id}</p>

<button on:click={logout}>Logout</button>
