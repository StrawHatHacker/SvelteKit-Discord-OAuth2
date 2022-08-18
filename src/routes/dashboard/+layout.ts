import { redirect } from '@sveltejs/kit';
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
		throw redirect(302, '/');

	const User: APIUser = await res.json();
	UserStore.setUser(User);

	return {};
}
