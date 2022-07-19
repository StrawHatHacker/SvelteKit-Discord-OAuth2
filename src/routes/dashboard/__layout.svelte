<script context="module" lang="ts">
	import type { IUserData } from 'src/interfaces';
	import { UserStore } from '$lib/stores';

	export async function load({ session, fetch }) {
		if (!session?.id)
			return {
				status: 302,
				redirect: '/'
			};

		const res = await fetch('/api/v1/user/validateSession', {
			method: 'POST',
			body: JSON.stringify({ sessionId: session.id } || {}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.status !== 200)
			return {
				status: 302,
				redirect: '/'
			};

		const User: IUserData = await res.json();
		UserStore.setUser(User);

		return {
			props: {}
		};
	}
</script>

<slot />
