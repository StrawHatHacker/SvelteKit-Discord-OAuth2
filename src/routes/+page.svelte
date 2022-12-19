<script>
	// @ts-ignore
	import { PUBLIC_DISCORD_AUTH_URI } from '$env/static/public';

</script>

<button on:click={() => (window.location.href = PUBLIC_DISCORD_AUTH_URI)}>
	Login with Discord
</button>
