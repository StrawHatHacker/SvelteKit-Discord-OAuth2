import { UserStore } from '$lib/stores';
import type { APIUser } from 'discord-api-types/v10';
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url }) => {
	const res = await fetch(url.origin + '/api/v1/user/validateSession', { method: 'POST' });

	if (res.status == 200)
	{
		const User: APIUser = await res.json();
		UserStore.setUser(User);
	}
}
