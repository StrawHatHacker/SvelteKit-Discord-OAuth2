<script context="module" lang="ts">
import { UserStore } from '$lib/stores';

	import type { APIUser } from 'discord-api-types/v10';

	export async function load({ fetch }) {
		const res = await fetch('/api/v1/user/validateSession', {
			method: 'POST',
			body: JSON.stringify({}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log(res);
		if (res.status !== 200)
			return {
				status: 302,
				redirect: '/'
			};

		const User: APIUser = await res.json();
		UserStore.setUser(User);

		return {
			props: {}
		};
	}
</script>

<slot />
