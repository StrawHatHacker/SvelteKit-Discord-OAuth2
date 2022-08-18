<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { UserStore } from '$lib/stores';


	let intervalId: NodeJS.Timer;
	onMount(async () => {
		// refresh the user's token every 5 minutes while they are still using the app
		intervalId = setInterval(async () => await fetch('/api/v1/user/refreshSession', {method: 'POST'}), 1000 * 60 * 5);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});

	async function logout() {
		await fetch('/api/v1/user/logout', {
			method: 'POST',
			body: JSON.stringify({})
		});

		window.location.href = '/';
	}
</script>

{#if $UserStore}
<p>User's Discord ID: {$UserStore.id}</p>
{/if}

<button on:click={logout}>Logout</button>
