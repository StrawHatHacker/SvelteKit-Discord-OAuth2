<script lang="ts">
	import { UserStore } from '$lib/stores';

	async function logout() {
		await fetch('/api/v1/user/logout', {
			method: 'POST',
			body: JSON.stringify({})
		});

		window.location.href = '/';
	}
</script>

<p>User's Discord ID: {$UserStore.id}</p>

<button on:click={logout}>Logout</button>
