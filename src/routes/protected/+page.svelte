<script lang="ts">
	import type { APIUser } from 'discord-api-types/v10';
	import { goto } from '$app/navigation';

	export let data: APIUser;

	async function logout() {
		await fetch('/api/v1/user/logout', {
			method: 'POST',
			body: JSON.stringify({})
		});

		goto('/');
	}
</script>

<p>User's Discord ID: {data.id}</p>

<button on:click={logout}>Logout</button>
